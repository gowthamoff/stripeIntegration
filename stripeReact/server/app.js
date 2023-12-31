require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

app.use(express.json());
app.use(cors());


// checkout api working
app.post("/api/create-checkout-session",async(req,res)=>{
    const {products} = req.body;


    const lineItems = products.map((product)=>({
        price_data:{
            currency:"inr",
            product_data:{
                name:product.dish,
                images:[product.imgdata]
            },
            unit_amount:product.price * 100,
        },
        quantity:product.qnty
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
        success_url:"http://localhost:3000/success",
        cancel_url:"http://localhost:3000/cancel",
    });

    // const refund = await stripe.refunds.create({
    //     payment_intent: 'pi_3O0G6zSD0yEYQlK21HDz7r6q',
    // }); 
    
    // const partial_refund = await stripe.refunds.create({
    //     payment_intent: 'pi_3O0GlFSD0yEYQlK20PTF7qff',
    //     amount: 35000, 
    //   });
    
    // console.log(partial_refund)

    res.json({id:session.id})
 
})


app.listen(7000,()=>{
    console.log("server start")
})