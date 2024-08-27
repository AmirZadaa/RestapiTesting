const mongoose=require("mongoose");
const morgan=require("morgan");
const cors=require("cors");
const  express=require("express");
const  dotenv=require("dotenv") ;
const route=require("./route/users")


const app=express();

dotenv.config();


function dbcon(){
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("database connected succcessfully");
    }).catch((erroe)=>{
        console.log(`some error in connection ${erroe}`);   
    })
}

dbcon()

app.use(express.json());
app.use(morgan('dev'))
app.use(cors())

app.use('/',route);

let port=process.env.PORT || 8000;
let host=process.env.HOST || '127.0.0.1'
app.listen(port,host,()=>{
  console.log(`server is runing at http://${host}:${port}`);
})




