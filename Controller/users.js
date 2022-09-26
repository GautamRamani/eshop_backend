const { user, User } = require("../Model/user");
const express = require("express");
const bcrypt=require("bcryptjs")
// const jwt=require("express-jwt")
const jwt=require("jsonwebtoken")
// const { default: mongoose } = require("mongoose");
// const { Category } = require("../Model/category");
const router = express.Router();

//get

router.get("/", async (req, res) => {
  const userList = await User.find().select("-passwordHash");
  //name email phone
  // const userList = await User.find().select("name email phone");
  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

//get by id

router.get("/:id", async (req, res) => {
  const userList = await User.findById(req.params.id);

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});


//post


router.post("/", async (req, res) => {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash:bcrypt.hashSync(req.body.passwordHash,10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });
    user = await user.save();
    if (!user) return res.status(400).send("the user cannot be found !");
    res.send(user);
  });

  //login post

  router.post("/login",async(req,res)=>{
    //express-jwt
    const user=await User.findOne({email:req.body.email})
    const secret=process.env.secret;
    if(!user){
      return res.status(400).send("The User not found")
    }
    if(user&&bcrypt.compareSync(req.body.passwordHash,user.passwordHash)){
      const token=jwt.sign({
        userId:user.id,
        //isAdmin:user.isAdmin
      },
      secret,
      {expiresIn:"1d"}
      );
      res.status(200).send({user:user.email,token:token})
    }else{
      res.status(400).send("Password is Wrong!")
    }
  })


// UPDATE


router.put("/:id",async (req,res)=>{
    let user = await User.findByIdAndUpdate(
        req.params.id,{
            name: req.body.name,
            email: req.body.email,
            passwordHash: req.body.passwordHash,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        },
        {new:true}
    )
    if(!user) return res.status(400).send("The user cannot be created");
    res.send(user)
});

//DELETE

router.delete("/:id",async (req,res)=>{
    User.findByIdAndRemove(req.params.id)
    .then((user)=>{
        if(user){
            return res
            .status (200)
            .json({success:true,message:"The user is deleted"})
        }
        else{
            return res
            .status(404)
            .json({success: false, message:"user not found"})
        }
    }) 
    .catch((err)=>{
        return res.status(500).json({success: false, error: err})
    });
});
  

module.exports = router;