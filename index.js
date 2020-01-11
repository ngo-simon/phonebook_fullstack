const express = require('express')
//var morgan = require('morgan')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
//var logger = morgan(':method :url :status :res[content-length] - :response-time ms :resp')
//app.use(logger)

let people = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id:1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id:2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id:3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id:4
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})
  
app.get('/api/persons', (req, res) => {
  res.json(people)
})

app.get('/info', (req, res) => {
  let total = people.length
  let time = new Date()
  res.send(
    `<div>
    <p>Phonebook has info for ${total} people</p>
    <p>${time}</p>
    </div>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = people.find(p => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  people = people.filter(p => p.id !== id)

  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * Math.floor(100000))
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  let name = body.name
  let bad_names = people.filter(p => p.name === name)

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  if (bad_names.length>0){
    return response.status(400).json({ 
      error: 'content already exists' 
    })
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  /*
  morgan.token('resp', function getResp (response) {
    return JSON.stringify(response.body)
  })*/

  people = people.concat(newPerson)
  response.json(newPerson)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})