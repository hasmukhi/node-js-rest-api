const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

/* for checking server
app.use((req,res,next) => {
	res.status(200).json({
		message:'It works!'
	});
});*/

mongoose.connect("mongodb+srv://nodeRestAdmin:"+ process.env.MONGO_ATLAS_PW+"@node-shop-rest-h2tpe.mongodb.net/test?retryWrites=true&w=majority",{
	//useMongoClient:true
	useNewUrlParser: true,
	useUnifiedTopology: true
});

/*const uri = "mongodb+srv://nodeRestAdmin:"+ process.env.MONGO_ATLAS_PW+"@node-shop-rest-h2tpe.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});*/
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin','*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	if(req.method === 'OPTIONS'){
		res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, GET');
		return res.status(200).json({});
	}
	next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
	const error = new Error('Not Found');
	error.status(404);
	next(error);
})

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error:{
			message:error.message
		}
	});
});

module.exports = app;