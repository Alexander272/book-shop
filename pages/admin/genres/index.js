import React, { useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import { AdminLayout } from '../../../Layout/AdminLayout'
import { ErrorLayout } from '../../../Layout/ErrorLayout'
import { AuthContext } from '../../../context/AuthContext'
import { Toasts } from '../../../Components/Toasts/Toasts'
import { Loader } from '../../../Components/Loader/Loader'
import { Button } from './../../../Components/Button/Button'
import GetGenres from '../../../graphql/query/getGenres'
import DeleteGenre from '../../../graphql/mutation/deleteGenre'
import classes from '../../../styles/admin.module.scss'

export default function AdminEdit() {
    const [genres, setGenres] = useState([])
    const [loadingDel, setLoadingDel] = useState(false)
    const [success, setSuccess] = useState('')
    const [errorDel, setErrorDel] = useState('')
    const [getGenres, { loading, error, data }] = useLazyQuery(GetGenres, { fetchPolicy: 'network-only' })
    const [deleteGenre] = useMutation(DeleteGenre)
    const router = useRouter()

    useEffect(() => {
        if (!data) getGenres()
        if (data) {
            setGenres(data.getGenres)
        }
    }, [data])

    const auth = useContext(AuthContext)
    if (auth.role === 'user' || !auth.isAuthenticated) {
        return <ErrorLayout />
    }

    const onRemoveHandler = async event => {
        const id = event.target.dataset.id
        try {
            setLoadingDel(true)
            const res = await deleteGenre({ variables: { id } })
            setSuccess(res.data.removeGenre)

            setGenres(prev => prev.filter(genre => genre.id != id))
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

    const addHandler = () => {
        router.push('/admin/genres/add')
    }

    return (
        <AdminLayout title="Genres" active="Жанры">
            <div className={classes.container}>
                <h1 className={classes.title}>Жанры книг</h1>
                {success.length > 0 && <Toasts type={'success'} message={success} />}
                {errorDel.length > 0 && <Toasts type={'error'} message={errorDel} />}
                <div className={classes.form}>
                    <Button text={'Добавть'} type="primary" icon={faPlus} onClick={addHandler} />
                    {loading || loadingDel ? (
                        <div className={classes.loader}>
                            <Loader size="md" />
                        </div>
                    ) : (
                        <div className={classes.books}>
                            {genres &&
                                genres.map(genre => {
                                    return (
                                        <div key={genre.id} className={classes.bookContainer}>
                                            <div className={classes.info}>
                                                <p className={classes.info_p}>
                                                    <b>Название</b>: {genre.name}
                                                </p>
                                                <p className={classes.info_p}>
                                                    <b>Название</b>: {genre.engName}
                                                </p>
                                            </div>
                                            <div className={classes.btns}>
                                                <Link href="/admin/genres/[id]" as={`/admin/genres/${genre.id}`}>
                                                    <a className={classes.btn_link}>
                                                        <FontAwesomeIcon className={classes.deleteIcon} icon={faEdit} />
                                                    </a>
                                                </Link>
                                                <p
                                                    onClick={onRemoveHandler}
                                                    data-id={genre.id}
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
