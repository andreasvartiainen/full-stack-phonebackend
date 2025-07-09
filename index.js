require('dotenv').config();

// express is json parser
const express = require('express');
// morgan adds debugging middleware to express
const morgan = require('morgan');

const Person = require('./models/Person');

const app = express();
app.use(express.json());
app.use(express.static('dist'));

const morganConfig = (tokens, req, res) => {
	morgan.token('body', (req,res) => {return JSON.stringify(req.body)})

  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
		tokens.body(req, res),
  ].join(' ')
}

app.use(morgan(morganConfig));

app.get('/api/persons', (request, response) => {
	Person.find({}).then((persons) => response.json(persons))
})

app.get('/api/persons/:id', (request, response) => {
	const id = request.params.id;
	const person = persons.find((d) => d.id === id)
	if (person)
		response.json(person);
	else
		response.status(404).json({error: `person with id ${id} not found`});
})

app.delete('/api/persons/:id', (request, response) => {
	const id = request.params.id;

	Person.findByIdAndDelete(id);

	response.status(204).send();
})

app.post('/api/persons', (request, response) => {
	const data = request.body

	if (!data.name && !data.number) 
		return response.status(400).json({error: 'missing data fields'});

	const person = new Person({
		name: data.name,
		number: data.number,
	})

	person.save()
		.then((person) => response.status(201).json(person))
		.catch((error) => response.status(400).json({error: error.message}));
})

const PORT = process.env.PORT || 3001;
app.listen(PORT,() => {
	console.log(`Server running on port ${PORT}`);
})
