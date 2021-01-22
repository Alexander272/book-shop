import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/react-hooks'
import { MainLayout } from '../Layout/MainLayout'
import { AuthContext } from './../context/AuthContext'
import { Loader } from '../Components/Loader/Loader'
import GetOrder from '../graphql/query/getOrder'
import classes from '../styles/ordersPage.module.scss'

export default function OrderPage() {
    const [order, setOrder] = useState([])
    const [getOrder, { loading, error, data, called }] = useLazyQuery(GetOrder)
    const auth = useContext(AuthContext)
    const router = useRouter()

    useEffect(() => {
        if (!auth.isAuthenticated) router.push('/')
    }, [])

    useEffect(() => {
        if (!error) getOrder({ variables: { id: auth.userId } })
        if (data) {
            setOrder(data.getOrder)
        }
    }, [loading, called])

    return (
        <MainLayout title="Заказы">
            <main className="content">
                {loading ? (
                    <Loader size="md" />
                ) : (
                    <>
                        <div className={classes.breadcrumbs}>
                            <Link href="/">
                                <a className={classes.text}>Главная</a>
                            </Link>{' '}
                            / <p className={classes.text}>Заказы</p>
                        </div>
                        <h1 className={classes.title}>Заказы</h1>
                        <div className={classes.books}>
                            {order ? (
                                order.map(o => {
                                    return (
                                        <div className={classes.order} key={o.id}>
                                            <h3 className={classes.orderTitle}>
                                                Заказ от {new Date(+o.dateOfOrders).toLocaleDateString()}
                                            </h3>
                                            <hr className={classes.hr} />
                                            <div>
                                                {o.book.map(book => {
                                                    return (
                                                        <div className={classes.book} key={book.bookId}>
                                                            <p className={classes.bookName}>
                                                                <Link href="/book/[id]" as={`/book/${book.bookId}`}>
                                                                    <a className={classes.link}>{book.name}</a>
                                                                </Link>{' '}
                                                                <span className={classes.warn}>{book.count}</span>
                                                            </p>
                                                            <p className={classes.price}>
                                                                Цена за 1 книгу:{' '}
                                                                <span className={classes.warn}>
                                                                    {new Intl.NumberFormat('ru-RU', {
                                                                        currency: 'RUB',
                                                                        style: 'currency',
                                                                    }).format(book.price)}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <p className={classes.empty}>Заказов пока нет</p>
                            )}
                        </div>
                    </>
                )}
            </main>
        </MainLayout>
    )
}
