const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());

const port = 5000;
const ObjectID = require('mongodb').ObjectID;

app.get('/', (req, res) => {
	res.send('Welcome! Creative Agency');
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lkrgo.mongodb.net/creativeAgency?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
client.connect((err) => {
	const serviceCollection = client.db('creativeAgency').collection('services');

	//Add new Service to database
	app.post('/addService', (req, res) => {
		const file = req.files.file;
		const title = req.body.title;
		const description = req.body.description;
		console.log(file, title, description);
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
	// Get Services from database
	app.get('/services', (req, res) => {
		serviceCollection.find({}).toArray((err, documents) => {
			res.send(documents);
		});
	});

	app.get('/serviceOrder/:id', (req, res) => {
		serviceCollection.find({ _id: ObjectID(req.params.id) }).toArray((err, documents) => {
			res.send(documents);
			console.log(documents);
		});
	});
});

app.listen(process.env.PORT || port, () => {
	console.log('Server is Running Perfectly');
});
