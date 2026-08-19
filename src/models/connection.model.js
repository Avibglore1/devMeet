import mongoose from "mongoose";
import User from "./user.model.js";

const connectionSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status:{
        type: String,
        enum: ["ignored","interested","accepted","rejected"],
        required: true,
        default: "ignored"
    }
},{timestamps: true});

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;

