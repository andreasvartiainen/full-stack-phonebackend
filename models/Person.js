const mongoose = require('mongoose');

url = process.env.MONGODB_URI

mongoose.connect(url)
	.then((_) => console.log('connected to MongoDB database'))
	.catch((error) => console.log('Error connecting to database', error.message))

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true,
	},
	// custom validator with regex
	number: {
		type: String,
		minLength: 8,
		validate : {
			validator: (v) => {
				return /\d{3}-\d{8}/.test(v);
			},
			message: props => `${props.value} is not a valid phone number`,
		},
		required: [true, 'User phone number required'],
	},
})

personSchema.set('toJSON', {
	transform: (_, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
})

module.exports = mongoose.model('Person', personSchema);
