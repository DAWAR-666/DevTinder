const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        maxlength:25,
        trim:true,
    },
    age:{
        type:Number,
        required:true,
        min:18,
        max:100
    },
    gender:{
        type:String,
        validate(value){
            if(!['male','female','other'].includes(value.toLowerCase())){
                throw new Error('Gender must be male, female or other');
            }
        }    
    },
},{timestamps:true});

module.exports=mongoose.model('User',userSchema);
