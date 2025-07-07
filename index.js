const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.json());

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

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
	response.send('<h1>Hello</h1>');
})

app.get('/info', (request, response) => {
	const date = new Date(Date.now()).toString()
	const page = `
		<div>Phonebook has info for ${persons.length} people</div>
		<div>${date}</div>
	`
	response.send(page);
})

app.get('/api/persons', (request, response) => {
	console.log(request);
	response.json(persons);
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
	persons = persons.filter((d) => d.id !== id);

	response.status(204).send();
})

const generateId = () => {
	return Math.round(Math.random() * 100000);
}

app.post('/api/persons', (request, response) => {
	const data = request.body

	if (persons.find((p) => p.name === data.name)){
		response.status(400).json({error: 'name must be unique'});
	}

	if (data.name && data.number) {
		const newPerson = {
			id: generateId().toString(),
			name: data.name,
			number: data.number,
		}

		persons = [...persons, newPerson];
		response.status(201).end();
	} else {
		const fields = Object.keys(persons[0]).filter((k) => k !== "id");
		response.status(400).json({error: `missing data: {${fields}} expected`});
	}
})

const PORT = 3001;
app.listen(PORT,() => {
	console.log(`Server running on port ${PORT}`);
})
