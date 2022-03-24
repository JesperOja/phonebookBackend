require('dotenv').config()
const express = require('express')
const res = require('express/lib/response')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
morgan.token('data', function getData (req){
    return [JSON.stringify(req.body)]
})
app.use(express.json())
app.use(morgan('tiny', {
    skip: function(req,res){
        return req.method === 'POST'
    }
}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data', {
    skip: function(req, res) {
    return req.method !== 'POST'
}}))
app.use(express.static('build'))

let persons = [

]

const generateId = () =>{
    const id = Math.random()*10000
    return id
}

app.get('/info', (req, res) => {
    
    const date = new Date()
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
  })

app.get('/api/persons', (req, res) =>{
    Person.find({}).then(persons => {
        res.json(persons)
    })
    
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person =>{
        response.json(person)
    })
  })

app.post('/api/persons', (req, res) =>{  
    const body = req.body

    if(!body.name || !body.number){
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const onList = persons.find(person => person.name === body.name)
    if(onList){
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})