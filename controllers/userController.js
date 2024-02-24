const User = require("../models/userModel")
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const generateToken = require("../config/generateToken")

const registerUser = asyncHandler(async(req,res) => {
   const {name, email, password} = req.body;

   const userExists = await User.findOne({email})

   if(userExists){
    return res.status(404).json({ message: "User already exists" });
   }

   const salt  = await bcrypt.genSalt(10);
   const secPassword = await bcrypt.hash(req.body.password, salt);

   const user = await User.create({
    name,
    email,
    password: secPassword
   })

   if(user){
    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        token: generateToken(user._id),
    });
   }else{
    res.status(400);
    throw new Error("User not found");
   }
});

const authUser = asyncHandler(async(req,res) => {
     const {email, password} = req.body;

     const user = await User.findOne({ email });
     if(!user){
      return res.status(404).json({ message: "No user Exists" });
     }

     const pwdCompare = await bcrypt.compare(req.body.password, user.password)

     if(!pwdCompare){
      return res.status(404).json({ message: "Incorrect Password" });
     }
     
     if(user && pwdCompare){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
          });
        } else {
          res.status(401);
          throw new Error("Invalid Email or Password");
        }
});


module.exports = {registerUser, authUser}