import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
       type: String,
       required: true,
       trim: true
    },
    lastName: {
        type: String,
        trim: true,
        default: "",
    },
    emailId: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Others"],
        default: null,
    },
    age: {
        type: Number,
        min: 18,
        default: null
    },
    photoUrl: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png"
    },
    about: {
        type: String,
        default: "This is a default of about the user!"
    },
    skills: {
        type: [String],
        default: []
    }
},{timestamps: true})


const User = mongoose.model("User", userSchema);

export default User