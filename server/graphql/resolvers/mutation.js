const { ApolloError, AuthenticationError } = require('apollo-server-express')
const bcript = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { isAdmin, isAuth } = require('../../middleware/auth.middleware')
const User = require('../../models/User')
const Book = require('../../models/Book')
const Order = require('../../models/Order')
const Subscribers = require('../../models/Subscribers')
const Genre = require('../../models/Genre')
const keys = require('../../keys')

const mutation = {
    Mutation: {
        async createUserToAdmin(_, { userInput }, context) {
            try {
                isAuth(context.req)
                isAdmin(context.req)

                const { name, email, password, role } = userInput
                const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
                if (name.trim().length <= 3 || password.trim().length < 6 || !reg.test(email))
                    throw new ApolloError('Введены некорректные данные')
                const candidate = await User.findOne({ email })
                if (candidate) throw new ApolloError('Введены некорректные данные')
                const hasPass = await bcript.hash(password, 16)
                const user = new User({
                    name,
                    email,
                    password: hasPass,
                    role,
                    created: context.req.session.userId,
                    promoted: null,
                })
                await user.save()
                return 'Пользователь успешно создан'
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        async createUser(_, { userInput }, context) {
            try {
                const { name, email, password, role } = userInput
                const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
                if (name.trim().length <= 3 || password.trim().length < 6 || !reg.test(email))
                    throw new AuthenticationError('Введены некорректные данные')
                const candidate = await User.findOne({ email })
                if (candidate) throw new AuthenticationError('Введены некорректные данные')
                const hasPass = await bcript.hash(password, 14)
                const user = new User({
                    name,
                    email,
                    password: hasPass,
                    role,
                    created: 'System',
                    promoted: null,
                })
                await user.save()
                return 'Регистрация прошла успешно'
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        async login(_, { email, password }, context) {
            try {
                const candidate = await User.findOne({ email })
                if (!candidate) throw new AuthenticationError('Введенные данные некорректны')
                const areSame = await bcript.compare(password, candidate.password)
                if (areSame) {
                    const token = jwt.sign(
                        {
                            email,
                            userName: candidate.name,
                            userId: candidate._id,
                            role: candidate.role,
                        },
                        keys.SESSION_SECRET,
                        { expiresIn: 6 * 60 * 60 },
                    )
                    context.req.session.token = token
                    context.req.session.userId = `${candidate._id}`
                    context.req.session.name = candidate.name
                    context.req.session.role = candidate.role
                    return { name: candidate.name, email, token, id: candidate._id, role: candidate.role }
                } else throw new AuthenticationError('Введенные данные некорректны')
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        async deleteUser(_, { id }, context) {
            try {
                isAuth(context.req)
                isAdmin(context.req)

                await User.deleteOne({ _id: id })
                return 'Пользователь успешно удален'
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        async logout(_, __, context) {
            try {
                await context.req.session.destroy()
                return 'Success logout'
            } catch ({ message }) {
                console.log(message)
                throw new AuthenticationError(message)
            }
        },
        async createNewBook(_, { book }, context) {
            try {
                isAuth(context.req)
                const candidate = await Book.findOne({ name: book.name })
                if (candidate) throw new ApolloError('Такая книга уже есть')
                const b = new Book({
                    name: book.name,
                    publisher: book.publisher,
                    annotation: book.annotation,
                    availability: book.availability,
                    author: book.author,
                    series: book.series,
                    theYearOfPublishing: +book.theYearOfPublishing,
                    ISBN: book.ISBN,
                    numberOfPages: +book.numberOfPages,
                    format: book.format,
                    translator: book.translator,
                    coverType: book.coverType,
                    circulation: +book.circulation,
                    weight: book.weight,
                    ageRestrictions: book.ageRestrictions,
                    genre: book.genre,
                    price: +book.price,
                    previewUrl: '',
                    previewName: '',
                })
                await b.save()
                return 'Книга успешно добавлена'
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        async deleteBook(_, { id }, context) {
            try {
                isAuth(context.req)

                await Book.deleteOne({ _id: id })
                return 'Книга успешно удалена'
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        async updateBook(_, { book, id }, context) {
            try {
                isAuth(context.req)

                await Book.updateOne({ _id: id }, { ...book })
                return 'Книга успешно обновлена'
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        async createOrder(_, { order }, context) {
            try {
                const { userId, book, name, price } = order
                const newOrder = new Order({
                    userId,
                    name,
                    book,
                    price,
                })
                await newOrder.save()
                return 'Заказ успешно добавлен'
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        async addSubscribers(_, { email }, context) {
            try {
                const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
                if (!reg.test(email)) throw new AuthenticationError('Введены некорректные данные')
                const candidate = await Subscribers.findOne({ email })
                if (!candidate) {
                    const sub = new Subscribers({
                        email,
                    })
                    sub.save()
                }
                return 'Подписка прошла успешно'
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        async updateUser(_, { id, email, name, password, newPassword }, context) {
            try {
                const user = await User.findById(id)
                const areSame = await bcript.compare(password, user.password)
                if (areSame) {
                    const hasPass = await bcript.hash(newPassword, 14)
                    await User.updateOne({ _id: id }, { email, name, password: hasPass })
                    return 'Данные успешно обновлены'
                } else throw new ApolloError('Введенные данные некорректны')
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },

        async addUserCart(_, { id, bookId, count }, context) {
            try {
                const book = await Book.findById(bookId)
                const user = await User.findById(id)
                await user.addToCart(book)
                return 'Книга успешно добавлена'
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        async addAllUserCart(_, { id, cart }, context) {
            try {
                const user = await User.findById(id)
                await user.addAllToCart(cart)
                return 'Книги успешно добавлены'
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        async removeUserCart(_, { id, bookId }, context) {
            try {
                const user = await User.findById(id)
                await user.removeFromCart(bookId)
                return 'Книга успешно удалена'
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        async removeBookUserCart(_, { id, bookId }, context) {
            try {
                const user = await User.findById(id)
                await user.removeBookFromCart(bookId)
                return 'Книга успешно удалена'
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        async removeAllUserCart(_, { id }, context) {
            try {
                const user = await User.findById(id)
                await user.clearCart()
                return 'Корзина очищена'
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        async addGenres(_, { name, engName }, context) {
            try {
                const newGenre = new Genre({
                    name,
                    engName,
                })
                await newGenre.save()
                return 'Жанр успешно создан'
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        async updateGenre(_, { id, name, engName }, context) {
            try {
                await Genre.updateOne({ _id: id }, { name, engName })
                return 'Жанр успешно обновлен'
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
        async removeGenre(_, { id }, context) {
            try {
                await Genre.deleteOne({ _id: id })
                return 'Жанр успешно удален'
            } catch (error) {
                throw new ApolloError(error.message)
            }
        },
    },
}
module.exports = mutation
