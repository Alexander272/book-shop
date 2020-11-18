import { createContext } from 'react'

function noop() {}

export const CardContext = createContext({
    userId: null,
    books: [],
    addToCard: noop,
    removeToCard: noop,
    removeAll: noop,
})
