const mongoose=require('mongoose');
const connectionRequestSchema=new mongoose.Schema({
    fromId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:string,
        enum:{
            values:["accepted","ignored","interested","rejected"],
            message:`{VALUE} is incorrect status`
        },
        required:true
    },
    
},{
    timestamps:true
})

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
