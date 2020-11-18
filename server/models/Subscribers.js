const { Schema, model } = require('mongoose')

const schema = new Schema({
    email: { type: String, required: true, unique: true },
})

module.exports = model('Subscribers', schema)
