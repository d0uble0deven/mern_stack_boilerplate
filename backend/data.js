const mongoose = require('mongoose')
const Schema = mongoose.Schema

// data structure of DB entries
const DataSchema = new Schema(
    {
        id: Number,
        message: String
    },
    { timestamps: true }
)

// exports new Schema, now can be modified using Node.js
module.exports = mongoose.model('Data', DataSchema)