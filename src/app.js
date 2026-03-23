const express=require('express');
const app=express();
app.use('/user',(req,res,next)=>{
    console.log('Request received and authenticating at /user');
    if(authToken==='xyz'){
    next()}
    else{
        res.status(401).send('Unauthorized');
    }
})
app.get('/user',(req,res)=>{res.send('sent user data')});
app.listen(8000,()=>{
    console.log('Server is running on port 8000');
});