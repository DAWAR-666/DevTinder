const express=require('express')
const requestRouter=express()
const ConnectionRequest=require('../models/connectionRequest.js')
const {userAuth}=require('../middleware/auth.js')

requestRouter.post("/request/send/:status/:toId",userAuth,async(req,res)=>{
    try{
        const Status=['ignored','interested']
        const fromId=req.user._id
        const toId=req.params.toId
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