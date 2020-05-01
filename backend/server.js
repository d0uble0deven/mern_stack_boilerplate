const mongoose = require('mongoose')
const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const logger = require('morgan')
const Data = require('./data')


//MongoDB
require('dotenv').config()
const dbRoute = process.env.DB_SERVER

const API_PORT = 3001
const app = express()
app.use(cors())
const router = express.Router()


// connects backend with DB
mongoose.connect(dbRoute, { useNewUrlParser: true })

let db = mongoose.connection

db.once('open', () => console.log('connected to the database'))

db.on('error', console.error.bind(console, 'MongoDB connection error: '))

// optional made for logging and bodyParser, parses request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(logger('dev'))

// get method, fetches all available data from DB
router.get('/getData', (req, res) => {
    // Data is schema, find is a Mongoose method
    Data.find((err, data) => {
        if (err) return res.json({ success: false, error: err })
        // return response in json format, setting data to arg
        return res.json({ success: true, data: data })
    })
})

// update method, overwrites existing data in DB
router.post('/updateData', (req, res) => {
    // id, update refer to user inputs, located in req.body
    const { id, update } = req.body
    // send user inputs into Data aka DB
    // updated entries are displayed with getData
    Data.findByIdAndUpdate(id, update, (err) => {
        if (err) return res.json({ success: false, error: err })
        return res.json({ success: true })
    })
})

// delete method, removes existing data in DB
router.delete('/deleteData', (req, res) => {
    // getting user input from req.body
    const { id } = req.body
    Data.findByIdAndRemove(id, (err) => {
        if (err) return res.send(err)
        return res.json({ success: true })
    })
})

// create method, adds new data to DB
router.post('/putData', (req, res) => {
    // create new document
    let data = new Data()
    // break user inputs in to id and message
    const { id, message } = req.body
    // if no message or incomplete message return warning
    if ((!id && id !== 0) || !message) {
        return res.json({
            success: false,
            error: 'INVALID INPUTS'
        })
    }
    // assign new documents with user inputs
    data.message = message
    data.id = id
    // save to DB
    data.save((err) => {
        if (err) return res.json({ success: false, error: err })
        return res.json({ success: true })
    })
})

//  append /api for all http requests
app.use('/api', router)

// launch backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`))