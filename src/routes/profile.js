const express=require('express')
const profileRouter=express();
const {userAuth}=require('../middleware/auth')



profileRouter.get("/profile",userAuth,async(req,res)=>{
    try{
        const user=req.user
        res.send(user);
    }catch(err){
        return res.status(400).send("Unauthorized: "+err.message);
    }
})

module.exports=profileRouter