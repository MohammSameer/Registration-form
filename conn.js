const { MongoClient } = require('mongodb');
const express=require("express");
const bodyParser = require("body-parser");
const { default: mongoose } = require('mongoose');
const app= express();
mongoose.connect("mongodb://0.0.0.0:27017/registration-form")
.then(()=>{
    console.log("connection successfull.....")
}).catch((err)=>{
    console.log(err)
})

const registrationSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : Number
  });
  

  

  
