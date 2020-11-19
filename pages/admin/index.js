import React, { useContext, useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import { AdminLayout } from '../../Layout/AdminLayout'
import { ErrorLayout } from '../../Layout/ErrorLayout'
import { AuthContext } from '../../context/AuthContext'
import { Loader } from '../../Components/Loader/Loader'
import GetStatistics from '../../graphql/query/getStatistics'
import classes from '../../styles/admin.module.scss'

export default function AdminPage() {
    const [stat, setStat] = useState(null)
    const [getStatistics, { loading, error, data, called }] = useLazyQuery(GetStatistics)

    useEffect(() => {
        if (!error) getStatistics()
        if (data) {
            setStat(data.getStatistics)
        }
    }, [loading, called])

    const auth = useContext(AuthContext)
    if (auth.role === 'user' || !auth.isAuthenticated) {
        return <ErrorLayout />
    }

    return (
        <AdminLayout active="Статистика">
            <div className={classes.container}>
                <h1 className={classes.title}>Статистика</h1>
                {loading ? (
                    <div className={classes.loader}>
                        <Loader size="md" />
                    </div>
                ) : (
                    stat && (
                        <div className={classes.form}>
                            <div className={classes.stat}>
                                <p className={classes.stat_p}>
                                    Всего покупок за месяц:{' '}
                                    <span className={classes.stat_warn}>{stat.totalPurchases}</span>
                                </p>
                                <p className={classes.stat_p}>
                                    Всего подписчиков: <span className={classes.stat_warn}>{stat.subscribers}</span>
                                </p>
                                <p className={classes.price}>
                                    Итоговая сумма всех покупок:{' '}
                                    <span className={classes.stat_warn}>
                                        {new Intl.NumberFormat('ru-RU', {
                                            currency: 'RUB',
                                            style: 'currency',
                                        }).format(stat.allPrice)}
                                    </span>
                                </p>
                            </div>
                            <div className={classes.books}>
                                <p className={[classes.stat_p, classes.books_p].join(' ')}>Купленные книги</p>
                                {stat.books.map(book => {
                                    return (
                                        <div className={classes.stat_book} key={book.bookId}>
                                            <p className={classes.book_name}>
                                                <span>{book.name}</span> &#10006;{' '}
                                                <span className={classes.book_warn}>{book.number}</span>
                                            </p>
                                            <p className={classes.book_name}>
                                                Цена за штуку: <span className={classes.book_warn}>{book.price}</span>
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                )}
            </div>
        </AdminLayout>
    )
}
