const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isConfirmed: { type: Boolean, required: true, default: false },
    name: { type: String, required: true },
    role: { type: String, required: true },
    registrationDate: { type: String, required: true, default: Date.now() },
    created: { type: String, required: true },
    promoted: { type: String, required: false },
    cart: {
        items: [
            {
                count: { type: Number, require: true, default: 1 },
                bookId: { type: Schema.Types.ObjectId, ref: 'Book', require: true },
            },
        ],
    },
})

userSchema.methods.addAllToCart = async function (books) {
    const items = this.cart.items.concat()

    for (let i = 0; i < books.length; i++) {
        const idx = items.findIndex(c => c.bookId.toString() === books[i].bookId.toString())
        if (idx >= 0) {
            items[idx].count = items[idx].count + books[i].count
        } else {
            items.push({
                bookId: books[i].bookId,
                count: books[i].count,
            })
        }
    }

    const newCart = { items }
    this.cart = newCart
    return await this.save()
}

userSchema.methods.addToCart = async function (book) {
    const items = this.cart.items.concat()
    const idx = items.findIndex(c => {
        return c.bookId.toString() === book._id.toString()
    })

    if (idx >= 0) {
        items[idx].count = items[idx].count + 1
    } else {
        items.push({
            bookId: book._id,
            count: 1,
        })
    }

    const newCart = { items }
    this.cart = newCart
    return await this.save()
}

userSchema.methods.removeFromCart = function (id) {
    let items = [...this.cart.items]
    const idx = items.findIndex(c => {
        return c.bookId.toString() === id.toString()
    })
    if (items[idx].count === 1) {
        items = items.filter(c => c.bookId.toString() !== id.toString())
    } else {
        items[idx].count--
    }
    this.cart = { items }
    return this.save()
}

userSchema.methods.removeBookFromCart = function (id) {
    let items = [...this.cart.items]
    items = items.filter(c => c.bookId.toString() !== id.toString())
    this.cart = { items }
    return this.save()
}

userSchema.methods.clearCart = function () {
    this.cart = { items: [] }
    return this.save()
}

module.exports = model('User', userSchema)
