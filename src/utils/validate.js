const validator=require('validator');
const validateUser=(user)=>{
    if(!user.firstName||!user.emailId||!user.password||!user.age){
        throw new Error('Missing required fields: firstName, emailId, password, age');
    }
    if(user.password.length<8||user.password.length>25){
        throw new Error('Password must be between 8 and 25 characters');
    }
    if(user.age<18||user.age>100){
        throw new Error('Age must be between 18 and 100');
    }
    if(user.gender&&!['male','female','other'].includes(user.gender.toLowerCase())){
        throw new Error('Gender must be male, female or other');
    }
    if(!validator.isEmail(user.emailId)){
        throw new Error('Invalid email address');
    }
    if(!validator.isStrongPassword(user.password)){
        throw new Error('Password is not strong enough');
    }
}
const validateProfileEdit=(req)=>{
    const allowedEdits=[
        'firstName',
        'lastName',
        'age',
        'gender'
    ]
    const isValid=Object.keys(req.body).every((field)=>
        allowedEdits.includes(field)
    )
    return isValid 
}
module.exports={validateUser,validateProfileEdit};