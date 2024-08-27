const express=require("express")
const {createUsers,getUsers,getUser,deleteUser,updateUser, login}=require("../controller/users")
const {checkauth,checkdmin}=require("../middleware/auth")

const route=express.Router();

route.post('/user/register',createUsers);
route.get("/users",checkauth,checkdmin,getUsers);
route.get("/user",checkauth, getUser);
route.put("/update",checkauth, updateUser);
route.post("/user/login",login)

module.exports=route;