const mongoose = require('mongoose');

url = process.env.MONGODB_URI

mongoose.connect(url)
	.then((_) => console.log('connected to MongoDB database'))
	.catch((error) => console.log('Error connecting to database', error.message))

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

personSchema.set('toJSON', {
	transform: (_, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
})

module.exports = mongoose.model('Person', personSchema);
