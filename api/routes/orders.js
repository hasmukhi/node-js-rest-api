const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

//handle incoming get request to orders
router.get('/', (req,res,next) =>{
    Order
    .find()
    .select("product quantity _id")
    .populate("product")
    .exec()
    .then(docs=>{
        res.status(200).json({
            count:docs.length,
            products:docs.map(doc=>{
                return {
                    quantity:doc.quantity,
                    productId:doc.product,
                    _id:doc._id,
                    type:'GET',
                    url:'http://localhost:300/orders/'+doc._id
                }

            })
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(505).json({error:err});
    });
});

router.post('/', (req,res,next) =>{
    Product.findById(req.body.productId)
    .then(product=>{
        if(!product){
            return res.status(404).json({
                message:'Product not found'
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity:req.body.quantity,
            product:req.body.productId
        });
        return order
        .save()    
    })
    .then(result=>{
        console.log(result);
        res.status(201).json({
            message:'Order created',
            createdOrder:{
                quantity:result.quantity,
                productId:result.product,
                _id:result._id,
                type:'GET',
                url:'http://localhost:3000/orders/' + result._id
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });    
});

router.get('/:ordreId',(req,res,next)=>{
    const id=req.params.orderId;
    Order.findById(id)
    .populate("product")
    .exec()
    .then(doc=>{
        console.log(doc);
        if(!doc){
            res.status(404).json({
                message: 'Order not found'
            });
        }
        res.status(200).json({
            order:doc,
            request:{
                type:'GET',
                url:'http://localhost:3000/orders/'
            }
        });
        
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
});

router.patch('/:orderId',(req,res,next) =>{

});

router.delete('/:orderId',(req,res,next)=>{
    Order.remove({_id:req.params.orderId})
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message:'Order deleted',
            request:{
                type:'POST',
                url:'http://localhost:3000/orders',
                body:{quantity:'Number', productId:'ID' }
            }
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
});

module.exports = router;