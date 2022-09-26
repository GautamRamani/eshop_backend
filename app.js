const express=require("express")
const app=express();
const bodyParser=require("body-parser")
// app.use(express.json())

const mongoose=require("mongoose")
const dotenv=require('dotenv').config()
const morgan=require("morgan")
const authJwt=require("./helpers/jwt")

const cors=require("cors");
app.use(cors())

//middleware
app.use(bodyParser.json())
app.use(morgan("tiny"))
// app.use(authJwt())


mongoose.connect(process.env.CONNECTION_URL)
.then(()=>console.log("Database Connected Successfully..."))
.catch((err)=>{console.log(err)})

const indexRouter=require("./Routes/index")   
app.use("/users",indexRouter)


app.listen(process.env.PORT,()=>console.log(`app listening on port ${process.env.PORT}`))
