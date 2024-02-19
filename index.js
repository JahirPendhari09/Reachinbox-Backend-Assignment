const express = require("express");
const app = express();
const cors = require("cors");
const { connection } = require("./db");
app.use(express.json());
app.use(cors());

app.get("/",(req,res)=> {
    try{
        res.status(200).send("data....")

    }catch(err){
        res.status(500).send({"msg":err})
    }
})

app.listen(process.env.PORT, async()=>{
    try{
        await connection
        console.log("Server is running")
    }
    catch(err){
        console.log(err)
    }
})