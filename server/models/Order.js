const { Schema, model, Types } = require('mongoose')

const orderSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User' },
    bookId: [{ type: Types.ObjectId, ref: 'Book' }],
    dateOfOrders: { type: String, required: true, default: Date.now },
})

module.exports = model('Order', orderSchema)
