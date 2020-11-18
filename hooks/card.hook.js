import { useState, useCallback, useEffect } from 'react'

export const useCard = () => {
    const [books, setBooks] = useState([])
    const [ready, setReady] = useState(false)

    const setInitialState = useCallback(data => {
        setBooks(data)
    })

    const addToCard = useCallback(book => {
        setBooks(prev => [...prev, book])
        const data = JSON.parse(localStorage.getItem('Books'))
        if (data) localStorage.setItem('Books', JSON.stringify([...data, book]))
        else localStorage.setItem('Books', JSON.stringify([book]))
    }, [])

    const removeToCard = useCallback(book => {
        setBooks(prev => prev.filter(b => b.id !== book.id))
        const data = JSON.parse(localStorage.getItem('Books'))
        localStorage.setItem('Books', JSON.stringify(data.filter(b => b.id !== book.id)))
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('Books'))
        if (data) {
            setInitialState(data)
        }
        setReady(true)
    }, [])

    return { books, addToCard, removeToCard, ready }
}
