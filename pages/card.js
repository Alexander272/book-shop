import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { useMutation } from '@apollo/react-hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { MainLayout } from '../Layout/MainLayout'
import { CardContext } from './../context/CardContext'
import { AuthContext } from './../context/AuthContext'
import CreateOrder from '../graphql/mutation/createOrder'
import classes from '../styles/cardPage.module.scss'

export default function CardPage() {
    const card = useContext(CardContext)
    const { userId, isAuthenticated } = useContext(AuthContext)
    const [books, setBooks] = useState(card.books)
    const [price, setPrice] = useState(0)
    const [number, setNumber] = useState(0)
    const [success, setSuccess] = useState('')
    const [createOrder] = useMutation(CreateOrder)

    useEffect(() => {
        let currentPrice = 0
        let currentNumber = 0
        books.forEach(book => {
            currentPrice += book.price * book.number
            currentNumber += book.number
        })
        setPrice(currentPrice)
        setNumber(currentNumber)
    }, [books])

    const removeHandler = event => {
        const index = books.findIndex(b => b.id === event.target.dataset.id)
        card.removeToCard(books[index])
        setBooks(prev => prev.filter(book => book.id !== event.target.dataset.id))
    }

    const numberChangedHandler = event => {
        const index = books.findIndex(b => b.id === event.target.dataset.id)
        if (event.target.dataset.action === '-') {
            setBooks(prev =>
                prev.map((book, i) => {
                    if (i === index) book.number > 2 ? (book.number = --book.number) : 1
                    return book
                }),
            )
        } else {
            setBooks(prev =>
                prev.map((book, i) => {
                    if (i === index) book.number = ++book.number
                    return book
                }),
            )
        }
    }

    const orderHandler = async () => {
        try {
            const res = await createOrder({
                variables: { order: { userId, book: books.map(book => ({ bookId: book.id, number: book.number })) } },
            })
            console.log(res.data.createOrder)
            setSuccess('Успешно')
            card.removeAll()
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
                            <div key={book.id} className={classes.bookContainer}>
                                <div className={classes.linkBlock}>
                                    <div className={classes.image}>
                                        <Link href="/book/[id]" as={`/book/${book.id}`}>
                                            <a>
                                                <img src={book.url} alt={book.name} />
                                            </a>
                                        </Link>
                                    </div>
                                    <div className={classes.info}>
                                        <p>
                                            <Link href="/book/[id]" as={`/book/${book.id}`}>
                                                <a className={classes.link}>{book.name}</a>
                                            </Link>
                                        </p>
                                        <p className={classes.info_text}>{book.author}</p>
                                    </div>
                                </div>
                                <div className={classes.btns}>
                                    <p className={classes.numberText}>
                                        Количество:{' '}
                                        <span
                                            onClick={numberChangedHandler}
                                            data-action="-"
                                            data-id={book.id}
                                            className={[classes.numberBtn, classes.ml, classes.numberBtnLeft].join(' ')}
                                        >
                                            -
                                        </span>
                                        <span className={classes.number}>{book.number}</span>
                                        <span
                                            onClick={numberChangedHandler}
                                            data-action="+"
                                            data-id={book.id}
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
                                            }).format(book.price)}
                                        </span>
                                    </p>
                                    <p onClick={removeHandler} data-id={book.id} className={classes.remove}>
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
