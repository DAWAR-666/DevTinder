const express=require('express')
const requestRouter=express.Router()
const ConnectionRequest=require('../models/connectionRequest.js')
const {userAuth}=require('../middleware/auth.js')
const User=require('../models/user.js')
requestRouter.post("/request/send/:status/:toId",userAuth,async(req,res)=>{
    try{
        const Status=['ignored','interested']
        const fromId=req.user._id
        const toId=req.params.toId
        const toIdExists=await User.findById(toId);
        if(!toIdExists){
            return res.status(400).json({message:"user not found"})
        }

        const status=req.params.status
        if(!Status.includes(status)){
            return res.status(400).send('invalid connection request')
        }
        const requestExists=await ConnectionRequest.findOne({
            $or:[
                {fromId,toId},
                {fromId:toId,toId:fromId}
            ]
        })
        if(requestExists){
            return res.status(400).json({message:'request already exists'})
        }
        const connectionRequest=new ConnectionRequest({
            fromId,toId,status
        })
        const data=await connectionRequest.save();
        res.json({
            message:"connection request send sucessfuly",
            data
        })
    }catch(err){
        res.status(400).json({message:"error:"+err.message})
    }
})
requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try{const allowedStatus=['accepted','rejected']
    const {status,requestId}=req.params
    if(!allowedStatus.includes(status)){
        return res.status(404).json({message:'request invalid'})
    }
    const loggenInUser=req.user
    const request=ConnectionRequest.fondOne({
        _id:requestId,
        toId:loggenInUser._id,
        status:'interested'
    })
    if(!request){
        return res.status(404).json({message:'request not found'})
    }
    request.status=status;
    const data=await request.save()
    res.json({message:'request '+status,
        data
    })}catch(err){
        res.status(404).json({message:'error: '+err.message})
    }
})
module.exports=requestRouter