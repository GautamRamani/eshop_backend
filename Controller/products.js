const express=require("express");
const { default: mongoose } = require("mongoose");
const { Category } = require("../Model/category");
const {Product}=require("../Model/product")
const router=express.Router();
const multer=require("multer")

const FILE_TYPE_MAP={
    "image/png":"png",
    "image/jpeg":"jpeg",
    "image/jpg":"jpg",
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid=FILE_TYPE_MAP[file.mimetype];
        let uploadError=new Error("invalid image upload")
        if(isValid){
            uploadError=null;
        }
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const filename=file.originalname.split(" ").join("-");
        const extension=FILE_TYPE_MAP[file.mimetype];
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null,`${filename}-${Date.now()}.${extension}`)
    }
  })
  
  const upload = multer({ storage: storage })

//get
// router.get("/",async(req,res)=>{
//     const productList=await Product.find();
//     if(!productList){
//         res.status(500).json({  
//             success:false
//         });
//     }
//     res.status(200).send(productList)
// })

//get by filter
router.get("/",async(req,res)=>{
    let filter={};
    if(req.query.categories){
        filter={category:req.query.categories.split(",")}
    }
    const productList=await Product.find(filter).populate("category")
    if(!productList){
        res.status(500).json({success:false})
    }
    res.send(productList)
})

//get by id
router.get("/:id",async(req,res)=>{
    const product=await Product.findById(req.params.id).populate("category");
    if(!product){
        res.status(500).json({success:false})
    }
    res.send(product)
})

//get by count

router.get("/get/count",async(req,res)=>{
    const productCount=await Product.countDocuments();
  
    
    if(!productCount){
      res.status(500).json({ success: false });
    }
    res.send({
      productCount:productCount,
    });
  })

//count category
router.get("/get/featured/:count",async(req,res)=>{
    const count=req.params.count?req.params.count:0;
    const products=await Product.find({isFeatured:true}).limit(+count)

    if(!products){
        res.status(500).json({success:false})
    }
    res.send(products)
})


//post
router.post("/",upload.array("images",10),async(req,res)=>{
    const category=await Category.findById(req.body.category)
    if(!category) return res.status(400).send("Invalid Category")

    const file=req.file;
    if(!file) return res.status(400).send("no image in the request")

    const fileName=file.filename;
    const basePath=`${req.protocol}://${req.get("host")}/public/uploads/`;
    console.log(basePath)

    let product=new Product({
        name:req.body.name,
        description:req.body.description,
        richDescription:req.body.richDescription,
        image:`${basePath}${fileName}`,
        images:req.body.images,
        brand:req.body.brand,
        price:req.body.price,
        category : req.body.category,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatured:req.body.isFeatured
    })
    await product.save()
            .then((createproduct)=>{
                
                    res.status(201).json(createproduct)
                })
            .catch((err)=>{
            res.status(500).json({
            error:err,
            success:false
        })
    })
})

//put
router.put("/:id",async(req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send("Invalid Product Id")
    }
    let category=await Category.findById(req.body.category)
    if(!category) return res.status(400).send("Invalid Category")

    let product=await Product.findByIdAndUpdate(
      req.params.id,
      { 
        name : req.body.name,
        description : req.body.description,
        richDescription : req.body.richDescription,
        image : req.body.image,
        images : req.body.images,
        brand : req.body.brand,
        price : req.body.price,
        category : req.body.category,   
        countInStock : req.body.countInStock,
        rating : req.body.rating,
        numReviews : req.body.numReviews,
        isFeatured : req.body.isFeatured,   
      },
      {new:true}
    );
    if (!product) return res.status(400).send("the category cannot be created..");
    res.send (product);
  });


  //delete
  router.delete("/:id",async (req,res)=>{
    Product.findByIdAndRemove(req.params.id)
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