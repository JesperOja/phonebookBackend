require('dotenv').config()
const express = require('express')
const res = require('express/lib/response')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const { request } = require('express')


const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
  }
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
app.use(errorHandler)
/*
let persons = [

]
*/

app.get('/info', (req, res) => {
    
    const date = new Date()
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
  })

app.get('/api/persons', (req, res) =>{
    Person.find({}).then(persons => {
        res.json(persons)
    })
    
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id).then(result => {
        response.status(204).end()
    }).catch(error => next(error))
  })

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person =>{
        if(oerson){
            response.json(person)
        }else{
            response.status(404).end()
        }
        
    }).catch(error =>next(error))
  })

app.put('/api/persons/:id'), (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatePerson => {
            response.json(updatePerson)
        }).catch(error => next(error))
}
app.post('/api/persons', (req, res) =>{  
    const body = req.body

    if(!body.name || !body.number){
        return res.status(400).json({
            error: 'content missing'
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