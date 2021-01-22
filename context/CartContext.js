import { createContext } from 'react'

function noop() {}

export const CartContext = createContext({
    userId: null,
    books: [],
    addToCart: noop,
    removeToCart: noop,
    removeAll: noop,
    removeBook: noop,
    concatCart: noop,
})
