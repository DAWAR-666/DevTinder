const mongoose=require('mongoose');
const User=require('./user')
const connectionRequestSchema=new mongoose.Schema({
    fromId:{
        ref:User,
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:User
    },
    status:{
        type:String,
        enum:{
            values:["accepted","ignored","interested","rejected"],
            message:`{VALUE} is incorrect status`
        },
        required:true
    },
    
},{
    timestamps:true
})
connectionRequestSchema.index({fromId:1,toId:1})
connectionRequestSchema.pre("save",function(){
    const connectionRequest=this;
    const fromId=connectionRequest.fromId;
    const toId=connectionRequest.toId;
    if(fromId.equals(toId)){
        throw new Error("cant send requesst to yourself")
    }
    next()
})

const ConnectionRequestModel=new mongoose.model("ConnectionRequest",connectionRequestSchema)
module.exports=ConnectionRequestModel
