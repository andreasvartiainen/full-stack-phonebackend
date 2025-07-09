const mongoose = require('mongoose');

if (process.argv.length < 3) {
	console.log('give password as argument to print all data from db');
	console.log('give password name number to add item to the db');
}

const password = process.argv[2];


const url = `mongodb+srv://tomvar98:${password}@cluster.rf51nux.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=Cluster`;

mongoose.get('strictQuery', false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length >= 5 ) {
	const person = new Person({
		name: process.argv[3],
		number: process.argv[4],
	});

	person.save().then( () => {
		console.log('person saved');
		mongoose.connection.close();
	});
} else {
	console.log('phonebook:');
	Person.find({}).then(result => {
		result.forEach(note => {
			console.log(note.name, note.number);
			mongoose.connection.close();
		});
	});
}
