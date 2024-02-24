import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";  
import { seedProdSpec, seedProduct, seedUser } from "./data"; 
import {dbConnect} from "./configs/database.config" ;
import asyncHandler from 'express-async-handler';
import { Users, UsersModel } from "./models/User.model";
import bodyParser from "body-parser"; 
import { Product,ProductModel } from "./models/product.model";
import { ProductSpecModel } from "./models/prodSpec.model";
dbConnect();  
const app = express(); 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    // Other CORS headers setup if needed...
    next();
  });
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
app.get("/sarabe/user",asyncHandler(
    async(req,res)=>{
        res.header('Access-Control-Allow-Origin', '*'); 
        const users = await UsersModel.find(); 
        res.send(users)
    }
))
app.post("/sarabe/user/Create",asyncHandler(
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
app.get("/sarabe/user/destro",asyncHandler(
    async(req,res)=>{
        const users = await UsersModel.deleteMany(); 
        res.send(users)
    }
)) 
app.get("/sarabe/user/seed",asyncHandler(
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
app.get("/sarabe/user/destro/:searchTerm",asyncHandler(
    async(req,res)=>{
        const searchTerm = req.params.searchTerm;
        await UsersModel.deleteOne({id:searchTerm}); 
        res.send(searchTerm)
    }
)) 
app.get("/sarabe/user/:email", asyncHandler(
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
app.get("/sarabe/destro",asyncHandler(
    async(req,res)=>{ 
        await UsersModel.deleteMany();  
        res.send(" All Data Erased ! ")
    }
)) 
app.get("/sarabe/seed",asyncHandler(
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
app.get("/sarabe/prod/destro",asyncHandler(
    async(req,res)=>{
        const prod = await ProductModel.deleteMany(); 
        const prodspec = await ProductSpecModel.deleteMany()
        res.send(prod)
        res.send(prodspec)
    }
)) 
app.get("/sarabe/prod/seed",asyncHandler(
    async (req,res)=>{
        const prod =await ProductModel.countDocuments();
        if(prod>0){
            res.send ("seed is already done");
            return;
        }
        await ProductModel.create(seedProduct)
        await ProductSpecModel.create(seedProdSpec)
        res.send("Product seed is done");
    }
)) 
app.get("/sarabe/prod",asyncHandler(
    async(req,res)=>{
        res.header('Access-Control-Allow-Origin', '*'); 
        const prod = await ProductModel.find(); 
        res.send(prod)
    }
))
app.get("/sarabe/prod/:prod", asyncHandler(
    async (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        const prod = req.params.prod; 
        const regex = new RegExp(prod, 'i'); // 'i' flag for case-insensitive search

        // Find users where the email partially matches
        const prods = await ProductSpecModel.find({ name: { $regex: regex } });

        if (!prods || prods.length === 0) {
            res.status(404).send("User not found"); 
            return;
        }

        res.send(prods); // Send matching users' details as the response
    }
));