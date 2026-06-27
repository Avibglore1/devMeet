import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    emailId: String,
    password: String,
    gender: String
})

const User = mongoose.model("User", userSchema);

export default User