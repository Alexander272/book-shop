import React, { useState, useContext, useEffect } from 'react'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { useMutation, useLazyQuery } from '@apollo/client/react/hooks'
import { AuthContext } from '../../../context/AuthContext'
import { Button } from '../../../Components/Button/Button'
import { Input } from '../../../Components/Input/Input'
import { Toasts } from '../../../Components/Toasts/Toasts'
import { AdminLayout } from '../../../Layout/AdminLayout'
import { Loader } from '../../../Components/Loader/Loader'
import { ErrorLayout } from '../../../Layout/ErrorLayout'
import UpdateGenre from '../../../graphql/mutation/updateGenre'
import GetGenreById from '../../../graphql/query/getGenreById'
import classes from '../../../styles/admin.module.scss'

export default function AdminUsersAdd() {
    const [form, setForm] = useState({
        name: '',
        engName: '',
    })
    const [success, setSuccess] = useState('')
    const [errorQ, setError] = useState('')
    const [loadingQ, setLoading] = useState(false)
    const [getGenre, { loading, error, data, called }] = useLazyQuery(GetGenreById)
    const [update] = useMutation(UpdateGenre)
    const router = useRouter()

    useEffect(() => {
        if (!error) getGenre({ variables: { id: router.query.id } })
        if (data) {
            setForm(data.getGenreById)
        }
    }, [loading, called])

    const auth = useContext(AuthContext)
    if (auth.role === 'user' || !auth.isAuthenticated) {
        return <ErrorLayout />
    }

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const createHandler = async () => {
        try {
            setLoading(true)
            const res = await update({ variables: { id: router.query.id, ...form } })
            setSuccess(res.data.updateGenre)
            // setTimeout(() => {
            //     setSuccess('')
            // }, 5500)
            router.push('/admin/genres')
            setLoading(false)
        } catch (e) {
            setLoading(false)
            setError(e.message.split(': ')[1])
            setTimeout(() => {
                setError('')
            }, 5500)
        }
    }

    return (
        <AdminLayout active="Жанры">
            {success.length > 0 && <Toasts type={'success'} message={success} />}
            {errorQ.length > 0 && <Toasts type={'error'} message={errorQ} />}
            <div className={classes.container}>
                <h1 className={classes.title}>Добавить жанр</h1>
                <div className={classes.form}>
                    {loading || loadingQ ? (
                        <div className={classes.loader}>
                            <Loader size={'md'} />
                        </div>
                    ) : (
                        <>
                            <Input
                                name={'name'}
                                type={'text'}
                                value={form.name}
                                placeholder={'Название'}
                                onChange={changeHandler}
                            />
                            <Input
                                name={'engName'}
                                type={'text'}
                                value={form.engName}
                                placeholder={'Название на английском'}
                                onChange={changeHandler}
                            />
                            <Button text={'Сохранить'} type="primary" icon={faPlus} onClick={createHandler} />
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}
