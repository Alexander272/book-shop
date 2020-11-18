const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    registrationDate: { type: String, required: true, default: Date.now() },
    created: { type: String, required: true },
    promoted: { type: String, required: false },
})

module.exports = model('User', userSchema)
