import express from "express";

const app = express();

app.use((req,res)=>{
    res.send("From server to u")
})
app.listen(4000, ()=>{
    console.log(`server is listening at 4000`);
})