const express = require('express');
const app = express();
app.use(express.json());

const data = [
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
		<div>Phonebook has info for ${data.length} people</div>
		<div>${date}</div>
	`
	response.send(page);
})

app.get('/api/persons', (request, response) => {
	console.log(request);
	response.json(data);
})

app.get('/api/persons/:id', (request, response) => {
	const id = request.params.id;
	const person = data.find((d) => d.id === id)
	if (person)
		response.json(person);
	else
		response.statusMessage = `Person with id ${id} not found`
		response.status(404).send();
})

const PORT = 3001;
app.listen(PORT,() => {
	console.log(`Server running on port ${PORT}`);
})
