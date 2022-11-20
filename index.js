const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const studentRouter = require("./Routes/studentRouter");
const mentorRouter = require("./Routes/mentorRouter");
const cors = require("cors");

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGO_URL,()=>{
    console.log("mongoDB is connected successfully!");
})

app.use(express.json());
app.use(cors());

app.get("/",async(req,res)=>{
    res.send("welcome to assign-mentor");
})

app.use("/student",studentRouter);
app.use("/mentor",mentorRouter);

app.listen(process.env.PORT,()=>{
    console.log(`app is started on ${process.env.PORT} PORT`)
})