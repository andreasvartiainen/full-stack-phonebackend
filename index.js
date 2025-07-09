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
	morgan.token('body', (req, res ) => { return JSON.stringify(req.body) });

	return [
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens.res(req, res, 'content-length'), '-',
		tokens['response-time'](req, res), 'ms',
		tokens.body(req, res),
	].join(' ');
};

app.use(morgan(morganConfig));

app.get('/info', (request, response, next) => {
	Person.find({}).then(persons => {
		return response.send(`<div>Phonebook has ${persons.length} entries</div>`);
	})
		.catch(error => next(error));
});

app.get('/api/persons', (request, response) => {
	Person.find({}).then((persons) => response.json(persons));
});

app.get('/api/persons/:id', (request, response, next) => {
	const id = request.params.id;

	Person.findById(id).then(note => {
		return response.json(note);
	})
		.catch(error => {
			return next(error);
		});
});

app.delete('/api/persons/:id', (request, response, next) => {
	const id = request.params.id;

	Person.findByIdAndDelete(id).then(result => {
		return response.status(204).end();
	})
		.catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
	const id = request.params.id;
	const { name, number } = request.body;

	Person.findById(id).then(note => {
		if (!note) {
			return response.status(404).end();
		}

		note.name = name;
		note.number = number;

		note.save().then(updatedPerson => {
			response.json(updatedPerson);
		})
			.catch(error => next(error));
	})
		.catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
	const data = request.body;

	if (!data.name || !data.number)
		return response.status(400).end();

	const person = new Person({
		name: data.name,
		number: data.number,
	});

	person.save()
		.then((person) => response.status(201).json(person))
		.catch(error => next(error));
});

const unknownEnpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

// error handler middleware
// has to be added last
const errorHandler = (error, _ , response, next) => {
	switch (error.name) {
	case 'CastError':
	{
		return response.status(400).send({ error: 'malformed id' });
	}
	case 'ValidationError':
	{
		return response.status(400).json({ error: error.message });
	}
	}

	next(error);
};

app.use(unknownEnpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
