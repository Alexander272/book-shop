import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { useLazyQuery } from '@apollo/react-hooks'
import { MainLayout } from '../Layout/MainLayout'
import { initApollo } from '../graphql/init/init-apollo'
import { Loader } from '../Components/Loader/Loader'
import { CartContext } from '../context/CartContext'
import { AuthContext } from './../context/AuthContext'
import GetBooks from '../graphql/query/getBooks'
import classes from '../styles/homePage.module.scss'

export default function HomePage({ bookProps }) {
    const cart = useContext(CartContext)
    const { userId } = useContext(AuthContext)
    const [books, setBooks] = useState(bookProps)
    const [purchasedBooks, setPurchasedBooks] = useState([])
    const [isReady, setIsReady] = useState(bookProps.length > 0)
    const [getBooks, { loading, error, data, called }] = useLazyQuery(GetBooks)

    useEffect(() => {
        setPurchasedBooks(cart.books.map(b => b.bookId.id))
    }, [cart.books])

    useEffect(() => {
        if (!error && bookProps.length === 0) getBooks()
        if (data) {
            setBooks(data.getBooks)
            setIsReady(true)
        }
    }, [loading, called])

    const addToCartHandler = event => {
        const book = books[event.target.dataset.index]
        if (!purchasedBooks.includes(book.id)) {
            cart.addToCart(
                cart.books,
                {
                    id: Date.now().toString(),
                    count: 1,
                    bookId: {
                        id: book.id,
                        name: book.name,
                        author: book.author,
                        previewUrl: book.previewUrl,
                        price: book.price,
                    },
                },
                userId,
            )
            setPurchasedBooks(prev => [...prev, book.id])
        }
    }

    return (
        <MainLayout title="Художественная литература">
            <main className="content">
                {!isReady || loading ? (
                    <Loader size="md" />
                ) : (
                    <>
                        <h1 className={classes.title}>Художественная литература</h1>
                        <div className={classes.books}>
                            {books.map((book, index) => {
                                return (
                                    <div key={book.id} className={classes.book}>
                                        <div className={classes.linkBlock}>
                                            <div className={classes.imageContainer}>
                                                <img
                                                    className={classes.image}
                                                    src={book.previewUrl}
                                                    alt={book.previewName}
                                                />
                                            </div>
                                            <div className={classes.minInfo}>
                                                <p className={classes.bookName}>{book.name}</p>
                                                <p className={classes.author}>{book.author}</p>
                                            </div>
                                            <Link href={'/book/[id]'} as={`/book/${book.id}`}>
                                                <a className={classes.link}></a>
                                            </Link>
                                        </div>
                                        {book.availability ? (
                                            <div className={classes.priceBlock}>
                                                <p
                                                    onClick={addToCartHandler}
                                                    data-index={index}
                                                    className={classes.price_buy}
                                                >
                                                    <span className={classes.price}>
                                                        {new Intl.NumberFormat('ru-RU', {
                                                            currency: 'RUB',
                                                            style: 'currency',
                                                        }).format(book.price)}
                                                    </span>
                                                    {purchasedBooks.includes(book.id) ? (
                                                        <span className={classes.buy}>В&nbsp;корзине</span>
                                                    ) : (
                                                        <span className={classes.buy}>Купить</span>
                                                    )}
                                                </p>
                                                <div
                                                    className={[
                                                        classes.bg,
                                                        purchasedBooks.includes(book.id) ? classes.lightBg : null,
                                                    ].join(' ')}
                                                ></div>
                                            </div>
                                        ) : (
                                            <div className={classes.bg_not}>
                                                <p className={classes.not}>Нет в наличии</p>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
            </main>
        </MainLayout>
    )
}

HomePage.getInitialProps = async ({ req }) => {
    if (!req) return { bookProps: [] }

    const apolloClient = initApollo(null)
    const data = await apolloClient.query({
        query: GetBooks,
    })

    return {
        bookProps: data.data.getBooks,
    }
}
