import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/react-hooks'
import { MainLayout } from '../../Layout/MainLayout'
import { initApollo } from '../../graphql/init/init-apollo'
import { Loader } from '../../Components/Loader/Loader'
import { CardContext } from './../../context/CardContext'
import GetBookById from '../../graphql/query/getBookById'
import classes from '../../styles/bookPage.module.scss'

export default function BookPage({ bookProps }) {
    const card = useContext(CardContext)
    const [book, setBook] = useState(bookProps)
    const [purchasedBook, setPurchasedBook] = useState(false)
    const [isReady, setIsReady] = useState(bookProps)
    const [getBookById, { loading, error, data, called }] = useLazyQuery(GetBookById)
    const router = useRouter()

    useEffect(() => {
        if (!error && !bookProps) getBookById({ variables: { id: router.query.id } })
        if (data) {
            setBook(data.getBookById)
            setIsReady(true)
        }
    }, [loading, called])

    useEffect(() => {
        if (book) {
            setPurchasedBook(card.books.findIndex(b => b.id === book.id) >= 0 ? true : false)
        }
    }, [book])

    const addToCardHandler = event => {
        if (!purchasedBook) {
            card.addToCard({
                id: book.id,
                name: book.name,
                author: book.author,
                price: book.price,
                url: book.previewUrl,
                number: 1,
            })
            setPurchasedBook(true)
        }
    }

    return (
        <MainLayout title={book ? book.name : 'book'}>
            <div className="content">
                <div className="container">
                    {!isReady || loading ? (
                        <Loader size="md" />
                    ) : (
                        <>
                            <div className={classes.breadcrumbs}>
                                <Link href="/">
                                    <a className={classes.text}>Главная</a>
                                </Link>{' '}
                                / <p className={classes.text}>{book.name}</p>
                            </div>
                            <div className={classes.container}>
                                <div className={classes.imageContainer}>
                                    <img src={book.previewUrl} alt={book.previewName} />
                                </div>
                                <div className={classes.info}>
                                    <h1 className={classes.title}>{book.name}</h1>
                                    <div className={classes.infoContainer}>
                                        <p className={classes.info_row}>
                                            <span className={classes.info_name}>Автор</span>
                                            <span className={classes.info_value}>{book.author}</span>
                                        </p>
                                        <p className={classes.info_row}>
                                            <span className={classes.info_name}>Жанр</span>
                                            <span className={classes.info_value}>{book.genre}</span>
                                        </p>
                                        {book.series && (
                                            <p className={classes.info_row}>
                                                <span className={classes.info_name}>Серия</span>
                                                <span className={classes.info_value}>{book.series}</span>
                                            </p>
                                        )}
                                        <p className={classes.info_row}>
                                            <span className={classes.info_name}>Издательство</span>
                                            <span className={classes.info_value}>{book.publisher}</span>
                                        </p>
                                        <p className={classes.info_row}>
                                            <span className={classes.info_name}>Год издания</span>
                                            <span className={classes.info_value}>{book.theYearOfPublishing}</span>
                                        </p>
                                        <p className={classes.info_row}>
                                            <span className={classes.info_name}>ISBN</span>
                                            <span className={classes.info_value}>{book.ISBN}</span>
                                        </p>
                                        <p className={classes.info_row}>
                                            <span className={classes.info_name}>Кол-во страниц</span>
                                            <span className={classes.info_value}>{book.numberOfPages}</span>
                                        </p>
                                        {book.translator && (
                                            <p className={classes.info_row}>
                                                <span className={classes.info_name}>Переводчик</span>
                                                <span className={classes.info_value}>{book.translator}</span>
                                            </p>
                                        )}
                                        <p className={classes.info_row}>
                                            <span className={classes.info_name}>Формат</span>
                                            <span className={classes.info_value}>{book.format}</span>
                                        </p>
                                        <p className={classes.info_row}>
                                            <span className={classes.info_name}>Тип обложки</span>
                                            <span className={classes.info_value}>{book.coverType}</span>
                                        </p>
                                        <p className={classes.info_row}>
                                            <span className={classes.info_name}>Тираж</span>
                                            <span className={classes.info_value}>{book.circulation}</span>
                                        </p>
                                        <p className={classes.info_row}>
                                            <span className={classes.info_name}>Вес</span>
                                            <span className={classes.info_value}>{book.weight}</span>
                                        </p>
                                        <p className={classes.info_row}>
                                            <span className={classes.info_name}>Возрастные ограничения</span>
                                            <span className={classes.info_value}>{book.ageRestrictions}</span>
                                        </p>
                                    </div>
                                    <div className={classes.price_buy}>
                                        <div className={classes.price}>
                                            <p className={classes.priceText}>
                                                {new Intl.NumberFormat('ru-RU', {
                                                    currency: 'RUB',
                                                    style: 'currency',
                                                }).format(book.price)}
                                            </p>
                                        </div>
                                        <div onClick={addToCardHandler} className={classes.buy}>
                                            <p className={classes.buyText}>{purchasedBook ? 'В корзине' : 'Купить'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.annotation}>
                                    <p className={classes.annotation_name}>Аннотация</p>
                                    <p className={classes.annotation_item}>{book.annotation}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}

BookPage.getInitialProps = async ({ query, req }) => {
    if (!req) return { bookProps: null }

    const apolloClient = initApollo(null)
    const data = await apolloClient.query({
        query: GetBookById,
        variables: { id: query.id },
    })

    return {
        bookProps: data.data.getBookById,
    }
}
