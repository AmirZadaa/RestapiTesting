const Users = require("../model/users");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const dotenv=require("dotenv")
const sendEmail=require("../utils/sendEmail") 
const sindmail=require('../utils/sindmail') 
 dotenv.config()
 
 





const getUsers = async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  
  }catch(error){
    res.status(400).json({ status: "error", message: error.message });
  }

 }
const getUser = async (req, res) => {
 try{
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(500).json({ id: "id is not valid" });
  }
    const user = await Users.findOne({ _id: _id });
    if (!user) {
      return res.status(400).json("user is not found throght this id");
    }
    res.status(200).json(user);

 }catch(error){
    res.status(400).json({ status: "error", message: error.message });
  }
};

const createUsers = async (req, res) => {
  try {
    const user = req.body;
    const { email, password } = user;
    const checkemail = await Users.findOne({ email: email });
    if (checkemail) {
      return res.status(400).json("email is already exists");
    }
    bcrypt.hash(password, 10, async (error, hash) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      }
      user.password = hash;
      const newUser = new Users(user);
      newUser.validateSync();
      const otp=Math.floor((Math.random()*1000000)+1);
      newUser.otp=otp;
      await newUser
        .save()
        .then(() => {
          sindmail.sentEmailnoti(newUser.email,newUser.name,"OTP VERIFICATAION",otp);
          return res.status(200).json({ User: "created", data: newUser });
        })
        .catch((err) => res.status(400).json({ err: err.message }));
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {

  try {

  
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(500).json({ id: "id is not valid" });
  }
  if(stat!="active"){
    return res.status(400).json({message:"user in not activa you not delete its records"})
  }
    const user = await Users.findOneAndDelete({ _id: _id });
    if (!user) {
      return res.status(400).json("user is not found throght this id");
    }

    return res.status(200).json({ status: "deleted", data: user });
 


 
   
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

const updateUser = (req, res) => {
  const user = req.body;
  try {
    if(stat!="active"){
      return res.status(400).json({message:"user in not activa you not update its records"})
    }
    if(!user.password){
      return res.status(400).json({error:"please enter password"})
    }
    bcrypt.hash(user.password,10,async (error,hash)=>{
      if (error) {
        return res.status(500).json({ message: error.message });
      }
      user.password = hash;
      const newUser = await Users.findOneAndUpdate({ _id: _id }, user, { new: true });
      if(!newUser){
        return res.status(400).json({Error:"User not found"})
      }
      return res.status(200).json({ status: "updated", data: newUser });
    })
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
  
const login = async (req, res) => {
  try {
    const { email, password,name } = req.body;
    const array = [];

    if (!email) {
      array.push("email is required");
    }
    if (!password) {
      array.push("password is required");
    }
    if (array.length > 0) {
      return res.status(200).json({ error: array });
    }
    const user = await Users.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "invalid email" });
    }
    bcrypt.compare(password, user.password, async (error, result) => {
      if (error) {
        return res.status(500).json({ messge: error.message });
      }
      if (result) {
        payload={_id:user._id,email:user.email,role:user.role,status:user.status}
        option={expiresIn:"1hr"}
        const token=jwt.sign(payload,process.env.JWT_SECRIT,option)
        //sned email

        sendEmail.sentEmail(email,name,"this is my subjects")
       
        //
        return res
          .status(200)
          .json({ status: "login succeesfully", token:token,user:user });
      } else {
        return res.status(400).json({ message: "invalid passwords" });
      }
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  createUsers,
  getUsers,
  getUser,
  deleteUser,
  updateUser,
  login,
};



