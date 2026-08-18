import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async(req,res) =>{
    try {
        const {firstName,emailId,password} = req.body;

        if(!firstName || !emailId || !password){
            return res.status(403).json({message: "All field are required"});
        }

        let user = await User.findOne({emailId});
        if(user){
            return res.status(403).json({message: "User already exist"});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        user = await User.create({firstName, emailId, password: hashedPassword})

        return res.status(201).json({message:"User created successfully", user})
    }
    catch (error) {
        return res.status(500).json({message: error.message})
    }
    
}

export const login = async(req,res) =>{
    try {
        const {emailId,password} = req.body;

        if(!emailId || !password){
            return res.status(403).json({message: "Email and password is required"})
        }

        let user = await User.findOne({emailId});
        if(!user){
            return res.status(403).json({message: "User do not exist"});
        }

        const isTrue = await bcrypt.compare(password, user.password);

        if(!isTrue){
            return res.status(403).json({message: "Invalid password"});
        }

        const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: "15m"});
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7*24*60*60*1000,
        });
        return res.status(200).json({message: "User loggedin successfully",user});

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getProfile = async(req,res) =>{
    try {
        const user = req.user;
        return res.status(200).json({message: "Profile fetched successfully", user});
    } catch (error) {
        return res.status(500).json({message: "Invalid token"});
    }
}

export const logout = async(req,res) =>{
    return res.cookie("token", null, {
        httpOnly: true,
        maxAge: 0
    }).json({message: "User logged out sucessfully"});
}

export const updateProfile = async(req,res) =>{
    try {
        let user = req.user;
        for(let key in req.body){
            if(key!==""){
                user[key] = req.body[key];
            }
           
        }
        await user.save()
        return res.status(200).json({message: "user data updated", user})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}