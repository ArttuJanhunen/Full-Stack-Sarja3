if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))
app.use(errorHandler)

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
    Person.find({}).then(people => {
        response.json(people.map(person => person.toJSON()))
    })
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
    /*const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }*/

    Person.findById(request.params.id).then(person => {

        response.json(note.toJSON())
    })
        .catch(error => {
            console.log(error)
            response.status(404).end()
        })

})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(people => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const createId = () => {
    const max = 10000000
    return Math.floor(Math.random() * max)
}


app.post('/api/persons', (request, response, next) => {
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

    const person = new Person({
        name: body.name,
        number: body.number
    })

    morgan.token('data', (request, response) => { return body })
    app.use(morgan('data'))

    console.log(request.body)

    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
