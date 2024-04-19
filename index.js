const express=require("express");
const { default: mongoose } = require('mongoose');
const bodyParser = require("body-parser");
const { MongoClient } = require('mongodb');
const timeout =require('express-timeout-handler');
const app= express();
require('./conn');

function requestTimeout(req,res,next){
  req.setTimeout(30000,() =>{
    res.status(503).send('Request timeout');
  });
  next();
}

app.use(requestTimeout);

const port = process.env.PORT || 27017;

app.get("/",(req, res)=>{
  res.sendFile(__dirname +"/pages/index.html");
})

const registrationSchema = new mongoose.Schema({
  name : String,
  email : String,
  password : Number
});

const Registration = mongoose.model("Registration",registrationSchema);
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

app.post("/register", async(req,res) =>{
  try{
    const {name,email,password} = req.body;
    const existinguser = await Registration.findOne({email: email});
    //check for exisiting user
    if(!existinguser){
      const registrationData =new Registration({
        name,
        email,
        password
      });
      app.use((req,res,next) =>{
        const timeout =setTimeout(()=>{
          res.status(503).send('request timeout');
        },30000);
        res.on('finish',()=>{
          clearTimeout(timeout);
        });
        next();
      });

      await registrationData.save();
      res.redirect("/success");
    }
    else{
      console.log('user already exists');
      res.redirect("/useralreadyexist");
    }
   
  }
  catch(error){
      console.log(error);
      res.redirect("/error");  
  }
})

app.get("/success",(req,res) =>{
  res.sendFile(__dirname+"/pages/success.html");
})

app.get("/error",(req,res) =>{
  res.sendFile(__dirname+"/pages/error.html");
})

app.get("/useralreadyexist",(req,res) =>{
  res.sendFile(__dirname+"/pages/useralreadyexist.html");
})

app.listen(port,() => {
    console.log(`server is running on port no ${port}`);
})