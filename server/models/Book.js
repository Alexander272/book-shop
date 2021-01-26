const { Schema, model, Types } = require('mongoose')

const bookSchema = new Schema({
    name: { type: String, required: true },
    publisher: { type: String, required: true },
    annotation: { type: String, required: true },
    availability: { type: Boolean, required: true },
    author: { type: String, required: true },
    series: { type: String, required: false },
    theYearOfPublishing: { type: Number, required: true },
    ISBN: { type: String, required: true },
    numberOfPages: { type: Number, required: true },
    format: { type: String, required: true },
    translator: { type: String, required: false },
    coverType: { type: String, required: false },
    circulation: { type: Number, required: false },
    weight: { type: String, required: false },
    ageRestrictions: { type: String, required: false },
    genre: { bookGanres: [{ genreId: { type: Types.ObjectId, ref: 'Genres', required: true } }] },
    price: { type: Number, required: true },

    previewUrl: String,
    previewName: String,
})

//     edition: { type: Number, required: true },

module.exports = model('Book', bookSchema)
