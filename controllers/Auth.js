const bcrypt = require("bcrypt");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// sign up route handler
exports.signup = async(req,res) => {
     try{
          // get input data
          const {name,email,role,password} = req.body;
          // check if user already exists
          const existingUser = await User.findOne({email});
console.log(existingUser);
          if(existingUser){
               return res.status(400).json({
                    success:false,
                    message:"User already exist"
               });

          }
          // secure password
          let hashedPassword;
          try{
               hashedPassword = await bcrypt.hash(password,10);
          }
          catch(error){
               res.status(500).json({
                    success:false,
                    message:"Error in hashing Password"
               });
          }

          // create entry for user

          const user = await User.create({
               name,email,password:hashedPassword,role
          });

          return res.status(200).json({
               success:true,
               message:"User created successfully"
          });
     }
     catch(error){
          console.error(error);
          return res.status(500).json({
               success:false,
               message:"user cannot be register, please try again later"
          });
     }
}

// login

exports.login = async(req,res) => {
     try{
          // data fetching
          const {email, password} = req.body;
          // validation
          if(!email || !password){
               return res.status(400).json({
                    success:false,
                    message:"please fill all the details"
               });
          }

          // check for registered user
          let user = await User.findOne({email});
          if(!user){
               return res.status(401).json({
                    success:false,
                    message:"User is not registered"
               });
          }

          const payload = {
               email:user.email,
               id:user._id,
               role:user.role
          }
          // verify password and generate jwt token
          if(await bcrypt.compare(password,user.password)){
               let token = jwt.sign(payload,process.env.JWT_SECRET,{
                    expiresIn:"2h",
               });

               // const oldUser = {...user,token};
               // oldUser.password = undefined;

               user = user.toObject();
               user.token = token;
               user.password = undefined;

               const options = {
                    expires: new Date(Date.now() + 3 *24 *60 *60 *1000),
                    httpOnly:true, 
               }

               res.cookie("token", token,options).status(200).json({
                    success:true,
                    token,
                    user,
                    message:"User logged in Successfully"
               });
          }
          else{
               // password do not match
               return res.status(403).json({
                    success:false,
                    message:"Password do not match"
               })
          }
     }
     catch(error){
          console.log(error);
          return res.status(500).json({
               success:false,
               message:"Login failure"
          });
     }
} 