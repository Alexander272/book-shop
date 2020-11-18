const { Schema, model, Types } = require('mongoose')

const orderSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User' },
    book: [
        {
            bookId: { type: Types.ObjectId, ref: 'Book' },
            number: { type: Number, required: true },
        },
    ],
    dateOfOrders: { type: String, required: true, default: Date.now },
})

module.exports = model('Order', orderSchema)
