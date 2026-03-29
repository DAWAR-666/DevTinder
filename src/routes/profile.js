const express=require('express')
const profileRouter=express();
const {userAuth}=require('../middleware/auth')
const {validateProfileEdit}=require ('../utils/validate.js')


profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try{
        const user=req.user
        res.send(user);
    }catch(err){
        return res.status(400).send("Unauthorized: "+err.message);
    }
})

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try{
        const isValid=validateProfileEdit(req)
        if(!isValid){throw new Error('invalid edit request')}
        const user=req.user;
        Object.keys(req.body).forEach((field)=>{
            user[field]=req.body[field]
        })
        await user.save()
        console.log(user)
        res.send(`${user.firstName}, your profile is updated!`)
    }catch(err){
        return res.status(400).send("error updating the details "+err.message)
    }
})

module.exports=profileRouter