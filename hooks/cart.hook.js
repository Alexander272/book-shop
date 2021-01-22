import { useState, useCallback, useEffect, useContext } from 'react'
import GetUserCart from '../graphql/query/getUserCart'
import AddUserCart from '../graphql/query/addUserCart'
import AddAllUserCart from '../graphql/query/addAllUserCart'
import RemoveUserCart from '../graphql/query/removeUserCart'
import RemoveBookUserCart from '../graphql/query/removeBookUserCart'
import RemoveAllUserCart from '../graphql/query/removeAllUserCart'

export const useCart = (apolloClient, userId) => {
    const [books, setBooks] = useState([])
    const client = apolloClient

    const addToCart = useCallback((books, book, id) => {
        const idx = books.findIndex(b => b.bookId.id === book.bookId.id)
        let newBooks = books
        if (idx > -1) {
            newBooks = books.map((b, index) => {
                if (index === idx) b.count = b.count + 1
                return b
            })
        } else {
            newBooks = books.concat([book])
        }
        setBooks(newBooks)
        if (id) {
            changeUserCart(AddUserCart, { id, bookId: book.bookId.id, count: book.count })
        } else {
            localStorage.setItem('Books', JSON.stringify(newBooks))
        }
    }, [])

    const removeToCart = useCallback((books, book, id) => {
        const idx = books.findIndex(b => b.bookId.id === book.bookId.id)
        let newBooks = books
        if (idx > -1) {
            newBooks = books.map((b, index) => {
                if (index === idx) b.count = b.count - 1
                return b
            })
            newBooks = newBooks.filter(b => b.count > 0)
        }
        setBooks(newBooks)
        if (id) {
            changeUserCart(RemoveUserCart, { id, bookId: book.bookId.id })
        } else {
            localStorage.setItem('Books', JSON.stringify(newBooks))
        }
    }, [])

    const removeBook = useCallback((books, book, id) => {
        const newBooks = books.filter(b => b.bookId.id !== book.bookId.id)
        setBooks(newBooks)
        if (id) {
            changeUserCart(RemoveBookUserCart, { id, bookId: book.bookId.id })
        } else {
            localStorage.setItem('Books', JSON.stringify(newBooks))
        }
    }, [])

    const removeAll = useCallback(id => {
        setBooks([])
        if (id) {
            changeUserCart(RemoveAllUserCart, { id })
        }
    })

    const concatCart = useCallback(async id => {
        const data = JSON.parse(localStorage.getItem('Books'))
        if (data) {
            await changeUserCart(AddAllUserCart, {
                id,
                cart: data.map(b => ({
                    bookId: b.bookId.id,
                    count: b.count,
                })),
            })
            localStorage.removeItem('Books')
            await getCart(id)
        }
    })

    const changeUserCart = useCallback(async (method, variables) => {
        try {
            const res = await client.mutate({
                mutation: method,
                variables: variables,
            })
        } catch (error) {
            console.log(error)
        }
    }, [])

    const getCart = useCallback(async id => {
        try {
            const res = await client.query({
                query: GetUserCart,
                variables: { id },
                fetchPolicy: 'network-only',
            })
            setBooks(res.data.getUserCart.cart.items)
        } catch (error) {
            console.log(error)
        }
    }, [])

    useEffect(() => {
        if (userId) {
            getCart(userId)
        } else {
            const data = JSON.parse(localStorage.getItem('Books'))
            if (data) {
                setBooks(data)
            }
        }
    }, [userId])

    return { books, addToCart, removeToCart, removeAll, removeBook, concatCart }
}
