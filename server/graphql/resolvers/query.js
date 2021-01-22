const { ApolloError } = require('apollo-server-express')
const { isAdmin, isAuth } = require('../../middleware/auth.middleware')
const User = require('../../models/User')
const Book = require('../../models/Book')
const Order = require('../../models/Order')
const Subscribers = require('../../models/Subscribers')

const query = {
    Query: {
        async getAllUsers(_, __, context) {
            try {
                isAuth(context.req)
                isAdmin(context.req)

                return await User.find({ role: ['editor', 'user'] })
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        async getBooks() {
            try {
                const books = await Book.find()
                books.sort((book1, book2) => {
                    if (book1.availability > book2.availability) {
                        return -1
                    }
                    if (book1.availability < book2.availability) {
                        return 1
                    }
                    return 0
                })
                return books
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        async getBookById(_, { id }, context) {
            try {
                return await Book.findById(id)
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        async getStatistics(_, __, context) {
            try {
                isAuth(context.req)
                const order = await Order.find()
                order.filter(o => new Date(+o.dateOfOrders).getMonth() === new Date(Date.now()).getMonth())
                const totalPurchases = order.length
                order.sort((order1, order2) => {
                    if (order1.id > order2.id) {
                        return -1
                    }
                    if (order1.id < order2.id) {
                        return 1
                    }
                    return 0
                })
                const subs = await Subscribers.countDocuments()
                let books = []
                order.forEach(o => {
                    o.book.forEach((book, i) => {
                        let isAdd = false
                        books.forEach(b => {
                            if (JSON.stringify(b.bookId) === JSON.stringify(book.bookId)) {
                                b.number += book.number
                                isAdd = true
                            }
                        })
                        if (!isAdd)
                            books.push({
                                bookId: book.bookId,
                                number: book.number,
                                name: book.name,
                                price: book.price,
                            })
                    })
                })
                let allPrice = 0
                books.forEach(book => {
                    allPrice += book.price * book.number
                })
                return {
                    books,
                    totalPurchases,
                    subscribers: subs,
                    allPrice,
                }
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        async getOrder(_, { id }, context) {
            try {
                const orders = await Order.find({ userId: id })
                orders.sort((a, b) => b.dateOfOrders - a.dateOfOrders)
                return orders
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        async getUser(_, { id }, context) {
            try {
                return await User.findById(id)
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        async getUserCart(_, { id }, context) {
            try {
                const user = await User.findById(id)
                const cart = await user.populate('cart.items.bookId').execPopulate()
                return cart
            } catch (error) {
                console.log(error.message)
                throw new ApolloError(error.message)
            }
        },
    },
}

module.exports = query
