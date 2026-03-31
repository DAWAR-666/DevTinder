const express=require('express')
const userRouter=express()
const {userAuth}=require('../middleware/auth')
const ConnectionRequest=require('../models/connectionRequest')
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
