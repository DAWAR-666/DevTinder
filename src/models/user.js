const jwt=require('jsonwebtoken')
const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require("bcrypt")
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
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email address');
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:8,
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
     photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about of the user!",
    },
    skills: {
      type: [String],
    },
},{timestamps:true});
userSchema.methods.getjwt=async function(){
    const user=this;
    const token= await jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
    return token;
}
userSchema.methods.ispasswordValid=async function (passwordInputByUser) {
    const user=this;
    const passwordHash=user.password;
    const isPassword=await bcrypt.compare(passwordInputByUser,passwordHash);
    return isPassword
    
}

module.exports=mongoose.model('User',userSchema);
