const mongoose=require("mongoose");

const userschema=new mongoose.Schema({
    name:{type:String, required: true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,unique:true},
    role:{type:String,default:"user"},
    status:{type:String,default:"inactive"},
    otp:String,
});

const Users=mongoose.model('users',userschema);
module.exports=Users;