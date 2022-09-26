const express=require("express")
const router=express.Router();
const {Category}=require("../Model/category")

//get
router.get("/",async(req,res)=>{
    const categoryList=await Category.find()
    if(!categoryList){
        res.status(500).json({success:false})
    }
    res.status(200).send(categoryList)
})

router.get("/:id",async(req,res)=>{
    let category=await Category.findById(req.params.id)
    if(!category){
        res.status(500).json({success:false})
        .json({msg:"The category with the given ID was not found"})
    }
    res.status(200).send(category)
})

//POST
router.post("/",async(req,res)=>{
    let category=new Category({
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color,
    });
    category=await category.save()
            if(!category)
            return res.status(400).send("this category cannot be created!")
            res.send(category)
})

//Update
router.put("/:id",async(req,res)=>{
    let category=await Category.findByIdAndUpdate(
      req.params.id,
      {
        name:req.body.name,
        icon:req.body.icon || category.icon,
        color:req.body.color,
      },
      {new:true}
    );
    if (!category) return res.status(400).send("the category cannot be created..");
    res.send (category);
  });

//DELETE

router.delete("/:id",async (req,res)=>{
    Category.findByIdAndRemove(req.params.id)
    .then((category)=>{
        if(category){
            return res
            .status (200)
            .json({success:true,message:"The category is deleted"})
        }
        else{
            return res
            .status(404)
            .json({success: false, message:"category not found"})
        }
    }) 
    .catch((err)=>{
        return res.status(500).json({success: false, error: err})
    });
});



module.exports=router;
