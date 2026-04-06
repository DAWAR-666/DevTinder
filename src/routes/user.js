const express=require('express')
const userRouter=express()
const {userAuth}=require('../middleware/auth')
const ConnectionRequest=require('../models/connectionRequest')
const USER_SAFE_DATA='firstName lastName age gender'
const User=require('../models/user.js')
userRouter.get('/user/requests/received',userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const requestList=await ConnectionRequest.find({
            toId:loggedInUser._id,
            status:'interested'
        }).populate(
            'fromId','firstName lastName age gender'
        )
        res.json({
            message:'data fetched successfully',
            data:requestList
        })
    }catch(err){
        res.status(400).send('Error: '+err.message)
    }
})

userRouter.get('/user/requests/connection',userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user
        const connections=ConnectionRequest.find({
            $or:[
                {toId:loggedInUser._id,status:'accepted'},
                {fromId:loggedInUser._id,status:'accepted'}
            ],
        }).populate('fromId',USER_SAFE_DATA).populate('toId',USER_SAFE_DATA)
        const data=connections.map((row)=>{
            if(row.fromId.toString()===loggedInUse._id.toString()){
                return row.toId
            }
            return row.fromId;
        })
        res.json({message:'data fetcehed successfully',data})
    }catch(err){
        res.status(400).send('Error: '+err.message)
    }
})


userRouter.get('/user/feed',userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;
        const connectionRequests=await ConnectionRequest.find({
            $or:[
                {fromId:loggedInUser._id},
                {toId:loggedInUser._id}
            ]
        }).select('fromId toId')
        const hiddenRequests=new Set()
        connectionRequests.forEach((req)=>{
            hiddenRequests.add(req.fromId.toString())
            hiddenRequests.add(req.toId.toString())
        })
        const users=await User.find({
            $and:[{_id:{$nin:Array.from(hiddenRequests)}},
            {_id:{$ne:loggedInUser._id}}]
        }).select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);
        res.json({data:users})
    }catch(err){
        res.status(400).send('Error- '+err.message)
    }
})
module.exports=userRouter