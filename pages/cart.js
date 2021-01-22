import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { useMutation } from '@apollo/react-hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { MainLayout } from '../Layout/MainLayout'
import { CartContext } from './../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import CreateOrder from '../graphql/mutation/createOrder'
import classes from '../styles/cardPage.module.scss'

export default function CardPage() {
    const cart = useContext(CartContext)
    const { userId, isAuthenticated } = useContext(AuthContext)
    const [price, setPrice] = useState(0)
    const [number, setNumber] = useState(0)
    const [success, setSuccess] = useState('')
    const [createOrder] = useMutation(CreateOrder)

    const books = cart.books

    useEffect(() => {
        let currentPrice = 0
        let currentNumber = 0
        books.forEach(book => {
            currentPrice += book.bookId.price * book.count
            currentNumber += +book.count
        })
        setPrice(currentPrice)
        setNumber(currentNumber)
    }, [books])

    const removeHandler = event => {
        const index = books.findIndex(b => b.bookId.id === event.target.dataset.id)
        cart.removeBook(books, books[index], userId)
    }

    const numberChangedHandler = event => {
        const index = books.findIndex(b => b.bookId.id === event.target.dataset.id)
        if (event.target.dataset.action === '-') {
            cart.removeToCart(books, books[index], userId)
        } else {
            cart.addToCart(books, books[index], userId)
        }
    }

    const orderHandler = async () => {
        try {
            const res = await createOrder({
                variables: {
                    order: {
                        userId,
                        book: books.map(book => ({
                            bookId: book.bookId.id,
                            name: book.bookId.name,
                            count: book.count,
                            price: book.bookId.price,
                        })),
                    },
                },
            })
            console.log(res.data.createOrder)
            setSuccess('Успешно')
            cart.removeAll(userId)
        } catch (error) {}
    }

    return (
        <MainLayout title="Корзина">
            <main className="content">
                <h1 className={classes.title}>Корзина</h1>
                <div>
                    {books.length === 0 && (
                        <>
                            <p className={classes.emptyCard}>Ваша корзина пуста</p>
                            <Link href="/">
                                <a className={classes.emptyCard_link}>Продолжить покупки?</a>
                            </Link>
                        </>
                    )}
                    {books.map(book => {
                        return (
                            <div key={book.bookId.id} className={classes.bookContainer}>
                                <div className={classes.linkBlock}>
                                    <div className={classes.image}>
                                        <Link href="/book/[id]" as={`/book/${book.bookId.id}`}>
                                            <a>
                                                <img src={book.bookId.previewUrl} alt={book.bookId.name} />
                                            </a>
                                        </Link>
                                    </div>
                                    <div className={classes.info}>
                                        <p>
                                            <Link href="/book/[id]" as={`/book/${book.bookId.id}`}>
                                                <a className={classes.link}>{book.bookId.name}</a>
                                            </Link>
                                        </p>
                                        <p className={classes.info_text}>{book.bookId.author}</p>
                                    </div>
                                </div>
                                <div className={classes.btns}>
                                    <p className={classes.numberText}>
                                        Количество:{' '}
                                        <span
                                            onClick={numberChangedHandler}
                                            data-action="-"
                                            data-id={book.bookId.id}
                                            className={[classes.numberBtn, classes.ml, classes.numberBtnLeft].join(' ')}
                                        >
                                            -
                                        </span>
                                        <span className={classes.number}>{book.count}</span>
                                        <span
                                            onClick={numberChangedHandler}
                                            data-action="+"
                                            data-id={book.bookId.id}
                                            className={[classes.numberBtn, classes.numberBtnRight].join(' ')}
                                        >
                                            +
                                        </span>
                                    </p>
                                    <p className={classes.priceText}>
                                        Цена за штуку:{' '}
                                        <span className={classes.price}>
                                            {new Intl.NumberFormat('ru-RU', {
                                                currency: 'RUB',
                                                style: 'currency',
                                            }).format(book.bookId.price)}
                                        </span>
                                    </p>
                                    <p onClick={removeHandler} data-id={book.bookId.id} className={classes.remove}>
                                        <FontAwesomeIcon className={classes.removeIcon} icon={faTrash} /> Удалить
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                    {books.length > 0 && (
                        <div className={classes.final}>
                            <div>
                                <p className={classes.finalPrice}>
                                    Итоговая цена:{' '}
                                    <span className={classes.price}>
                                        {new Intl.NumberFormat('ru-RU', {
                                            currency: 'RUB',
                                            style: 'currency',
                                        }).format(price)}
                                    </span>
                                </p>
                                <p className={classes.finalNumber}>
                                    Количество книг: <span className={classes.price}>{number}</span>
                                </p>
                            </div>
                            <div className={classes.order}>
                                {isAuthenticated ? (
                                    success.length === 0 ? (
                                        <p onClick={orderHandler} className={classes.finalBtn}>
                                            Оформить заказ
                                        </p>
                                    ) : (
                                        <p className={classes.order_textSuc}>Спасибо за офрмление заказа</p>
                                    )
                                ) : (
                                    <p className={classes.order_text}>
                                        Необходимо авторизироваться для офрмления заказа
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </MainLayout>
    )
}
