const { Schema, model } = require('mongoose')

const schema = new Schema({
    name: { type: String, required: true, unique: true },
    engName: { type: String, required: true, unique: true },
})

module.exports = model('Genres', schema)
