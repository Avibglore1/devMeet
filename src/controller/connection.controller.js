import Connection from "../models/connection.model.js";
import User from "../models/user.model.js";

export const requestConnection = async(req,res) =>{
    try {
       const fromUserId = req.user._id;
       const {status,toUserId} = req.params;

       if(status!=="ignored" && status!=="interested"){
        return res.status(400).json({message: "Status can only be ignored and interested"});
       }

       const user = await User.findById(toUserId);
       if(!user){
        return res.status(403).json({message: "User not found"});
       }

       if(fromUserId.toString()===toUserId.toString()){
        return res.status(401).json({message: "You cannot send connection request to yourself"});
       }

       const existingConnection = await Connection.findOne({fromUserId,toUserId});
       if(existingConnection){
        return res.status(402).json({message: "Connection request already exists"});
       }

       const reverseConnectionRequest = await Connection.findOne({fromUserId: toUserId, toUserId: fromUserId});
       if(reverseConnectionRequest){
        return res.status(401).json({message: "User already sent you connection request"});
       }

       const newConnection = await Connection.create({fromUserId, toUserId, status});

       return res.status(201).json({message: "Connection request sent successfully", connection: newConnection});

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

export const reviewConnection = async(req,res) =>{
    try {
        const toUserId = req.user._id;
        const {status,fromUserId} = req.params;
        
        if(status!=="accepted" && status!=="rejected"){
            return res.status(402).json({message: "Status can only be accepted or rejected"});
        }

        const connection = await Connection.findOne({
            fromUserId,
            toUserId,
            status: "interested"
        });

        if(!connection){
            return res.status(404).json({message: "Connection not found"});
        }

        connection.status = status;

        await connection.save();

        if(status==="accepted"){
            return res.status(200).json({message: "Connection request accepted", connection})
        }
        else{
            return res.status(200).json({message: "Connection request rejected", connection})
        }
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

export const getAllPendingRequests = async(req,res) =>{
    try {
        const toUserId = req.user._id;

        const connection = await Connection.find({
            toUserId,
            status: "interested"
        }).populate("fromUserId", "firstName lastName");

        return res.status(200).json({message: "Pending requests fetched successfully", connection});
    } catch (error) {
        return res.status(403).json({message: error.message})
    }
}

export const getAllConnections = async(req,res) =>{
    try {
        const loggedInUser = req.user;

        const connection = await Connection.find({
            $or : [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ],
            status: "accepted"
        }).populate("fromUserId toUserId", "firstName lastName");

        if(!connection){
            return res.status(404).json({message: "You dont have any accepted connection"})
        }

        return res.status(200).json({message: "All connections fetched successfully", connection});
    } catch (error) {
        return res.status(403).json({message: error.message})
    }
}

export const getAllFeeds = async(req,res) =>{
    try {
        const loggedInUser = req.user;

        const connections = await Connection.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ],
            status: "accepted"
        });

        const hideUsersFromFeed = new Set();
        hideUsersFromFeed.add(loggedInUser._id.toString());

        connections.forEach(connection => {
            hideUsersFromFeed.add(connection.fromUserId.toString());
            hideUsersFromFeed.add(connection.toUserId.toString());
        });

        const users = await User.find({
            _id: { $nin: Array.from(hideUsersFromFeed) }
        }).select("firstName lastName photoUrl age gender about skills");

        return res.status(200).json({
            message: "Feeds fetched successfully",
            data: users
        });
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}
