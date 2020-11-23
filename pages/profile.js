import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import { MainLayout } from '../Layout/MainLayout'
import { AuthContext } from './../context/AuthContext'
import { Loader } from '../Components/Loader/Loader'
import { Input } from '../Components/Input/Input'
import { Toasts } from '../Components/Toasts/Toasts'
import GetUser from '../graphql/query/getUser'
import UpdateUser from '../graphql/mutation/updateUser'
import classes from '../styles/profilePage.module.scss'
import { from } from 'apollo-boost'

export default function ProfilePage() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        newPassword: '',
        confirm: '',
    })
    const [success, setSuccess] = useState('')
    const [errorQuery, setErrorQuery] = useState('')
    const [loadingQuery, setLoadingQuery] = useState(false)
    const [getUser, { loading, error, data, called }] = useLazyQuery(GetUser)
    const [updateUser] = useMutation(UpdateUser)
    const auth = useContext(AuthContext)

    useEffect(() => {
        if (!error) getUser({ variables: { id: auth.userId } })
        if (data) {
            setForm(prev => ({ ...prev, ...data.getUser }))
        }
    }, [loading, called])

    if (!auth.isAuthenticated) {
        return <ErrorLayout />
    }

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const saveHandler = async () => {
        const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
        if (reg.test(email)) {
            setErrorQuery('Неккоректный email')
            setTimeout(() => {
                setErrorQuery('')
            }, 5500)
        } else if (form.password === form.newPassword) {
            setErrorQuery('Новый пароль должен отличаться')
            setTimeout(() => {
                setErrorQuery('')
            }, 5500)
        } else if (form.newPassword !== form.confirm) {
            setErrorQuery('Пароли не совпадают')
            setTimeout(() => {
                setErrorQuery('')
            }, 5500)
        } else {
            try {
                setLoadingQuery(true)
                const res = await updateUser({
                    variables: {
                        id: form.id,
                        email: form.email,
                        name: form.name,
                        password: form.password,
                        newPassword: form.newPassword,
                    },
                })
                setSuccess(res.data.updateUser)
                setTimeout(() => {
                    setSuccess('')
                }, 5500)
                setLoadingQuery(false)
            } catch (error) {
                setLoadingQuery(false)
                setErrorQuery(e.message.split(': ')[1])
                setTimeout(() => {
                    setErrorQuery('')
                }, 5500)
            }
        }
    }

    return (
        <MainLayout title="Профиль">
            <main className="content">
                {success.length > 0 && <Toasts type={'success'} message={success} />}
                {errorQuery.length > 0 && <Toasts type={'error'} message={errorQuery} />}
                {loading || loadingQuery ? (
                    <Loader size="md" />
                ) : (
                    <>
                        <div className={classes.breadcrumbs}>
                            <Link href="/">
                                <a className={classes.text}>Главная</a>
                            </Link>{' '}
                            / <p className={classes.text}>Профиль</p>
                        </div>
                        <h1 className={classes.title}>Профиль</h1>
                        <div className={classes.form}>
                            {form && (
                                <>
                                    <Input
                                        name="name"
                                        placeholder="Никнейм"
                                        type="text"
                                        value={form.name}
                                        onChange={changeHandler}
                                    />
                                    <Input
                                        name="email"
                                        placeholder="Ваш email"
                                        type="email"
                                        value={form.email}
                                        onChange={changeHandler}
                                    />
                                    <Input
                                        name="password"
                                        placeholder="Старый пароль"
                                        type="password"
                                        value={form.password}
                                        onChange={changeHandler}
                                    />
                                    <Input
                                        name="newPassword"
                                        placeholder="Новый пароль"
                                        type="password"
                                        value={form.newPassword}
                                        onChange={changeHandler}
                                    />
                                    <Input
                                        name="confirm"
                                        placeholder="Повторите новый пароль"
                                        type="password"
                                        value={form.confirm}
                                        onChange={changeHandler}
                                    />
                                </>
                            )}

                            <p onClick={saveHandler} className={classes.btn}>
                                Сохранить
                            </p>
                        </div>
                    </>
                )}
            </main>
        </MainLayout>
    )
}
