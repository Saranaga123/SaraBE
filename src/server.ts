import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";  
import { seedProduct, seedUser } from "./data"; 
import {dbConnect} from "./configs/database.config" ;
import asyncHandler from 'express-async-handler';
import { Users, UsersModel } from "./models/User.model";
import bodyParser from "body-parser"; 
import { Product,ProductModel } from "./models/product.model";
dbConnect();  
const app = express(); 
app.use(bodyParser.json({
    limit: '50mb'
  })); 
  app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true 
  }));
app.use (cors({
    credentials:true,
    origin:[ "*"]
}));
const port = process.env.PORT || 666;
app.listen(port,()=>{
    console.log("Website served on http://localhost:" + port);
})
//User Related
app.get("/api/user",asyncHandler(
    async(req,res)=>{
        res.header('Access-Control-Allow-Origin', '*'); 
        const users = await UsersModel.find(); 
        res.send(users)
    }
))
app.post("/api/user/Create",asyncHandler(
    async(req,res,next)=>{
        await UsersModel.deleteMany(); 
        res.header('Access-Control-Allow-Origin', '*'); 
        const {name,password,role,email,bod,nic,occupation,gender,image,status}=req.body; 
        const newuser:Users = {
            id: '',
            name: name,
            password: password,
            role: role,
            email: email,
            bod: bod,
            nic: nic,
            occupation: occupation,
            gender: gender,
            image: image,
            status: status
        }  
        const dbUser = await UsersModel.create(newuser);
        res.send("Done")
    }
)) 
app.get("/api/user/destro",asyncHandler(
    async(req,res)=>{
        const users = await UsersModel.deleteMany(); 
        res.send(users)
    }
)) 
app.get("/api/user/seed",asyncHandler(
    async (req,res)=>{
        const houserents =await UsersModel.countDocuments();
        if(houserents>0){
            res.send ("seed is already done");
            return;
        }
        await UsersModel.create(seedUser)
        res.send("user seed is done");
    }
))    
app.get("/api/user/destro/:searchTerm",asyncHandler(
    async(req,res)=>{
        const searchTerm = req.params.searchTerm;
        await UsersModel.deleteOne({id:searchTerm}); 
        res.send(searchTerm)
    }
)) 
app.get("/api/user/:email", asyncHandler(
    async (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        const userEmail = req.params.email; 
        const user = await UsersModel.findOne({ email: userEmail });  

        if (!user) {
            res.status(404).send("User not found"); 
            return;
        }

        res.send(user);  
    }
));
app.get("/api/destro",asyncHandler(
    async(req,res)=>{ 
        await UsersModel.deleteMany();  
        res.send(" All Data Erased ! ")
    }
)) 
app.get("/api/seed",asyncHandler(
    async (req,res)=>{  
        const userCount =await UsersModel.countDocuments();
        if(userCount>0){
            await UsersModel.deleteMany(); 
            await UsersModel.create(seedUser)
        }else{
            await UsersModel.create(seedUser)
        }  
        res.send("Data Seeding Done ! ") 
    }
))
//Ecom related 
//Ecom Product related 
app.get("/api/prod/destro",asyncHandler(
    async(req,res)=>{
        const prod = await ProductModel.deleteMany(); 
        res.send(prod)
    }
)) 
app.get("/api/prod/seed",asyncHandler(
    async (req,res)=>{
        const prod =await ProductModel.countDocuments();
        if(prod>0){
            res.send ("seed is already done");
            return;
        }
        await ProductModel.create(seedProduct)
        res.send("Product seed is done");
    }
)) 