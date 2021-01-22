import React, { useState, useContext } from 'react'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useMutation } from '@apollo/client/react/hooks'
import { AuthContext } from '../../../context/AuthContext'
import { Button } from '../../../Components/Button/Button'
import { Input } from '../../../Components/Input/Input'
import { Toasts } from '../../../Components/Toasts/Toasts'
import { AdminLayout } from '../../../Layout/AdminLayout'
import { Loader } from '../../../Components/Loader/Loader'
import { ErrorLayout } from '../../../Layout/ErrorLayout'
import createGenre from '../../../graphql/mutation/createGenre'
import classes from '../../../styles/admin.module.scss'

export default function AdminUsersAdd() {
    const [form, setForm] = useState({
        name: '',
        engName: '',
    })
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [create] = useMutation(createGenre)

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
            const res = await create({ variables: { ...form } })
            setSuccess(res.data.addGenres)
            setTimeout(() => {
                setSuccess('')
            }, 5500)
            setForm({
                name: '',
                engName: '',
            })
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
            {error.length > 0 && <Toasts type={'error'} message={error} />}
            <div className={classes.container}>
                <h1 className={classes.title}>Добавить жанр</h1>
                <div className={classes.form}>
                    {loading ? (
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
                            <Button text={'Создать'} type="primary" icon={faPlus} onClick={createHandler} />
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}
