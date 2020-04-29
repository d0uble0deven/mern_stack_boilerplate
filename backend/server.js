const mongoose = require('mongoose')
const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const logger = require('morgan')
const Data = require('./data')


const API_PORT = 3001
const app = express()
app.use(cors())
const router = express.Router()

//MongoDB
const dbRoute = 'mongodb://<your-db-username-here>:<your-db-password-here>@ds249583.mlab.com:49583/fullstack_app'

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
    Data.find((err, data) => {
        if (err) return res.json({ success: false, error: err })
        return res.json({ success: true, data: data })
    })
})

// update method, overwrites existing data in DB
router.post('/updateData', (req, res) => {
    const { id, update } = req.body
    Data.findByIdAndUpdate(id, update, (err) => {
        if (err) return res.json({ success: false, error: err })
        return res.json({ success: true })
    })
})

// delete method, removes existing data in DB
router.delete('/deleteData', (req, res) => {
    const { id } = req.bodyData.findByIdAndRemove(id, (err)) => {
        if (err) return res.send(err)
        return res.json({ success: true })
    }
})

// create method, adds new data to DB
router.post('/putData', (res, res) => {
    let data = new Data()

    const { id, message } = req.body

    if ((!id && id !== 0) || !message) {
        return res.json({
            success: false,
            error: 'INVALID INPUTS'
        })
    }
    data.message = message
    data.id = id
    data.save((err) => {
        if (err) return res.json({ success: false, error: err })
        return res.json({ success: true })
    })
})

//  append /api for all http requests
app.use('/api', router)

// launch backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`))

