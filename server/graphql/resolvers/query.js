const { ApolloError } = require('apollo-server-express')
const { isAdmin, isAuth } = require('../../middleware/auth.middleware')
const User = require('../../models/User')
const Book = require('../../models/Book')
const Order = require('../../models/Order')

const query = {
    Query: {
        async getAllUsers() {
            try {
                // isAuth(context.req)
                // isAdmin(context.req)

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
    },
}

module.exports = query
