const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const nameInput = process.argv[3]
const numberInput = process.argv[4]


const url = `mongodb+srv://ArttuJanhunen:${password}@fullstack-400g5.mongodb.net/person-app?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)
if (process.argv.length > 3) {
    const person = new Person({
        name: nameInput,
        number: numberInput
    })

    person.save().then(response => {
        console.log('person saved!')
        mongoose.connection.close()
    })
} else if (process.argv.length = 3) {
    console.log('puhelinluettelo:')
    Person.find({}).then(people => {
        people.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}


/*mongodb+srv://ArttuJanhunen:<PASSWORD>@fullstack-400g5.mongodb.net/person-app?retryWrites=true
*/