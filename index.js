const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')


app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())


let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "045-1236543"
    },
    {
        id: 2,
        name: "Arto Järvinen",
        number: "041-21423123"
    },
    {
        id: 3,
        name: "Lea Kutvonen",
        number: "040-4323234"
    },
    {
        id: 4,
        name: "Martti Tienari",
        number: "09-784232"
    }
]

app.get('/', (require, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (require, response) => {
    response.json(persons)
})

app.get('/info', (require, response) => {
    const personsSize = persons.length
    const date = new Date()
    response.send(`
    <p>Puhelinluettelossa on ${personsSize} henkilön tiedot</p>
    <p>${date}</p>
    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id != id)

    response.status(204).end()
})

const createId = () => {
    const max = 10000000
    return Math.floor(Math.random() * max)
}


app.post('/api/persons', (request, response) => {
    const body = request.body



    if (body.name === undefined || body.name === "") {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (body.number === undefined || body.number === "") {
        return response.status(400).json({
            error: 'number missing '
        })
    }

    const personNames = persons.map(person => person.name)

    if (personNames.includes(body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: createId(),
        name: body.name,
        number: body.number
    }

    morgan.token('data', (request, response) => { return body })
    app.use(morgan('data'))

    console.log(request.body)

    persons = persons.concat(person)
    response.json(person)
})


const PORT = process.envPORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)