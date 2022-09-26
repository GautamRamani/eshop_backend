const express=require("express")
const router=express.Router();

router.use("/products",require("../Controller/products"))
router.use("/categories",require("../Controller/categories"))
router.use("/users",require("../Controller/users"))
router.use("/orders",require("../Controller/orders"))


module.exports=router;