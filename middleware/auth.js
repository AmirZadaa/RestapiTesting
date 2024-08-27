const jwt=require("jsonwebtoken");
const dotenv=require("dotenv");
dotenv.config()


const checkauth=(req,res,next)=>{
    try{
        const token=req.headers.authorization;
        if(!token){
            return res.status(400).json({message:"token is not avaible"})
        }
        const token1=token.split(" ")[1]
        jwt.verify(token1,process.env.JWT_SECRIT,(err,decoded)=>{
            if(err){
                return res.status(400).json({message:"token is not valid"})
            }
          _id=decoded._id;
          role=decoded.role;
          stat=decoded.status;
            next()
        })
    }catch(error){
        res.status(400).json({message:"internal server error",error:error})
    }
}

const checkdmin=(req,res,next)=>{
   try {
    let role=req.role;
    if(!role || role!='admin'){
        return res.status(400).json({message:"you are not admin"})
    }   
    next()
   } catch (error) {
    res.status(400).json({message:"internal server error",error:error})
    
   }
}
module.exports={checkauth,checkdmin};