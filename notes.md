## HTTP

HEAD exactly like GET but doesn't return anything but status code

All but POST request should be idempotent, so result of these requests should be the same regardless of how many times the request is sent. State of the database shouldn't change.

POST is the only HTTP request type that is neither safe nor idempotent. If we send 5 different HTTP POST requests to /api/notes with a body of {content: "many same", important: true}, the resulting 5 notes on the server will all have the same content.

## Middleware

Express json-parser is middleware

Middleware are functions that can be used for handling request and response objects.
