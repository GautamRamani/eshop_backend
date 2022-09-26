const express=require("express")
const router=express.Router();
const {Order}=require("../Model/order")
const {OrderItem}=require("../Model/order-item")

router.post("/",async (req,res)=>{
    const orderItemsIds=Promise.all(
        req.body.orderItems.map(async(orderitem)=>{
            let newOrderItem=new OrderItem({
                quantity:orderitem.quantity,
                product:orderitem.product
            });
            newOrderItem=await newOrderItem.save();
            return newOrderItem._id;
        })
    )
    const orderItemsIdsResolved=await orderItemsIds;

        const totalPrices=await Promise.all(
            orderItemsIdsResolved.map(async(orderItemsId)=>{
                const orderItem=await OrderItem.findById(orderItemsId).populate(
                    "product",
                    "price"
                );
                const totalPrice=orderItem.product.price*orderItem.quantity;
                return totalPrice;
            })
        );
        const totalPrice=totalPrices.reduce((a,b)=>a+b,0);
        console.log(totalPrices);

    let order = new Order({
        orderItems:orderItemsIdsResolved,
        shippingAddress1:req.body.shippingAddress1,
        shippingAddress2:req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice:totalPrice,
        user:req.body.user,
      });
      order = await order.save();
      if (!order) return res.status(400).send("the user cannot be found !");
      res.status(200).send(order);
})

module.exports=router;
