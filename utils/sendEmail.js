const nodemailer=require("nodemailer")
const dotenv=require("dotenv")
const hbs=require("nodemailer-express-handlebars")
const path=require("path")
dotenv.config()


const transporter = nodemailer.createTransport({
    service:process.env.SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const handlebarsOptions = {
    viewEngine: {
        extName: ".handlebars", 
      partialsDir:path.resolve("./veiw/"),
      defaultLayout: false,
    },
    extname: ".handlebars",
    viewPath: path.resolve("./veiws/"),  
  };
  transporter.use("compile", hbs(handlebarsOptions));

const sentEmail=async(email,name,subject)=>{
    console.log(name,email,subject);
    
    try {
        const info = await transporter.sendMail({
          from: '"Hi im amir  👻" <zad22@gmail.com>', // sender address
          template:"email", 
          to: email, // list of receivers
          subject:subject, // Subject line
          context:{
            name:name,
          }
        });
      
        console.log("Message sent: %s", info.messageId);
        
    } catch (error) {
        console.log("while error snding ",error)
    }
}

module.exports={sentEmail};