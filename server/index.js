const express=require("express")
require('dotenv').config();
const app=express()
const connection=require("./config/db")

const carrouter=require("./routes/car.routes")
app.use(express.json())







const PORT = process.env.PORT;
const cors = require('cors');


const {authRouter} = require('./routes/user.routes');


app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);

app.use("/car",carrouter)

app.get("/",(req,res)=>{
    res.send("send data")
})


app.listen(5000, async () => {
    try {
      await connection;
      console.log("db is running");
    } catch (error) {
      console.log(error);
    }
    console.log(`port is running 5000`);
  });