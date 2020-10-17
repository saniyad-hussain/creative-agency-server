const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cors = require('cors');
const { ObjectID } = require('mongodb');
const env = require('dotenv').config();
const fileUpload = require('express-fileupload');
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zjgsq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
	const serviceCollection = client.db('creativeAgency').collection('services');
	const orderCollection = client.db('creativeAgency').collection('orders');
	const adminCollection = client.db('creativeAgency').collection('admins');
	const reviewCollection = client.db('creativeAgency').collection('reviews');

	app.post('/addService', (req, res) => {
		const file = req.files.file;
		const title = req.body.title;
		const description = req.body.description;

		const newImg = file.data;
		const encImg = newImg.toString('base64');
		var image = {
			contentType: req.files.file.mimetype,
			size: req.files.file.size,
			img: Buffer.from(encImg, 'base64'),
		};

		serviceCollection.insertOne({ title, description, image }).then((result) => {
			res.send(result.insertedCount > 0);
		});
	});

	app.get('/services', (req, res) => {
		serviceCollection.find({}).toArray((err, documents) => {
			res.send(documents);
		});
	});

	app.get('/serviceOrder/:id', (req, res) => {
		serviceCollection.find({ _id: ObjectID(req.params.id) }).toArray((err, documents) => {
			res.send(documents);
		});
	});

	app.post('/postOrder', (req, res) => {
		const file = req.files.file;
		const name = req.body.name;
		const email = req.body.email;
		const project = req.body.project;
		const details = req.body.details;
		const price = req.body.price;
		const status = req.body.status;

		const newImg = file.data;
		const encImg = newImg.toString('base64');
		var image = {
			contentType: req.files.file.mimetype,
			size: req.files.file.size,
			img: Buffer.from(encImg, 'base64'),
		};
		orderCollection.insertOne({ name, email, project, details, price, status, image }).then((result) => {
			res.send(result.insertedCount > 0);
		});
	});

	app.get('/getServiceByEmail', (req, res) => {
		orderCollection.find({ email: req.query.email }).toArray((err, documents) => {
			res.send(documents);
		});
	});

	app.get('/getAllService', (req, res) => {
		orderCollection.find({}).toArray((err, documents) => {
			res.send(documents);
		});
	});

	app.patch('/updateStatus', (req, res) => {
		console.log(req.query.id);
		const newStatus = req.body.status;
		orderCollection.updateOne({ _id: ObjectID(req.query.id) }, { $set: { status: newStatus } }).then((result) => {
			console.log(result);
			res.send(result.modifiedCount > 0);
		});
	});

	app.post('/makeAdmin', (req, res) => {
		const newOrder = req.body;
		adminCollection.insertOne(newOrder).then((result) => {
			res.send(result.insertedCount > 0);
		});
	});

	app.get('/findAdminByEmail', (req, res) => {
		adminCollection.find({ email: req.query.email }).toArray((err, documents) => {
			res.send(documents);
		});
	});

	app.post('/addReview', (req, res) => {
		const file = req.files.file;
		const name = req.body.name;
		const designation = req.body.designation;
		const comment = req.body.comment;

		const newImg = file.data;
		const encImg = newImg.toString('base64');
		var image = {
			contentType: req.files.file.mimetype,
			size: req.files.file.size,
			img: Buffer.from(encImg, 'base64'),
		};

		reviewCollection.insertOne({ name, designation, comment, image }).then((result) => {
			res.send(result.insertedCount > 0);
		});
	});

	app.get('/reviews', (req, res) => {
		reviewCollection.find({}).toArray((err, documents) => {
			res.send(documents);
		});
	});
});

app.listen(port, () => {
	console.log(`Running`);
});
