import React, { useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import { AdminLayout } from '../../../Layout/AdminLayout'
import { ErrorLayout } from '../../../Layout/ErrorLayout'
import { AuthContext } from '../../../context/AuthContext'
import { Toasts } from './../../../Components/Toasts/Toasts'
import { Loader } from './../../../Components/Loader/Loader'
import GetBooks from '../../../graphql/query/getBooksAdmin'
import DeleteBook from '../../../graphql/mutation/deleteBook'
import classes from '../../../styles/admin.module.scss'

export default function AdminEdit() {
    const [books, setBooks] = useState([])
    const [loadingDel, setLoadingDel] = useState(false)
    const [success, setSuccess] = useState('')
    const [errorDel, setErrorDel] = useState('')
    const [getBooks, { loading, error, data, called }] = useLazyQuery(GetBooks)
    const [deleteBook] = useMutation(DeleteBook)

    useEffect(() => {
        if (!error) getBooks()
        if (data) {
            setBooks(data.getBooks)
        }
    }, [loading, called])

    const auth = useContext(AuthContext)
    if (auth.role === 'user' || !auth.isAuthenticated) {
        return <ErrorLayout />
    }

    const onRemoveHandler = async event => {
        const id = event.target.dataset.id
        try {
            setLoadingDel(true)
            const res = await deleteBook({ variables: { id } })
            setSuccess(res.data.deleteBook)

            setBooks(prevState => prevState.filter(book => book.id != id))
            setTimeout(() => {
                setSuccess('')
            }, 5500)
            setLoadingDel(false)
        } catch (e) {
            setLoadingDel(false)
            setErrorDel(e.message.split(': ')[1])
            setTimeout(() => {
                setErrorDel('')
            }, 5500)
        }
    }

    return (
        <AdminLayout title="Edit books" active="Редактировать">
            <div className={classes.container}>
                <h1 className={classes.title}>Редактировать товар</h1>
                {success.length > 0 && <Toasts type={'success'} message={success} />}
                {errorDel.length > 0 && <Toasts type={'error'} message={errorDel} />}
                <div className={classes.form}>
                    {loading || loadingDel ? (
                        <div className={classes.loader}>
                            <Loader size="md" />
                        </div>
                    ) : (
                        <div className={classes.books}>
                            {books &&
                                books.map(book => {
                                    return (
                                        <div key={book.id} className={classes.bookContainer}>
                                            <div className={classes.info}>
                                                <p className={classes.info_p}>
                                                    <b>Автор</b>: {book.author}
                                                </p>
                                                <p className={classes.info_p}>
                                                    <b>Назввние</b>: {book.name}
                                                </p>
                                            </div>
                                            <div className={classes.btns}>
                                                <Link href="/admin/edit/[id]" as={`/admin/edit/${book.id}`}>
                                                    <a className={classes.btn_link}>
                                                        <FontAwesomeIcon className={classes.deleteIcon} icon={faEdit} />
                                                    </a>
                                                </Link>
                                                <p
                                                    onClick={onRemoveHandler}
                                                    data-id={book.id}
                                                    className={classes.btn_del}
                                                >
                                                    <FontAwesomeIcon className={classes.deleteIcon} icon={faTrash} />
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}
