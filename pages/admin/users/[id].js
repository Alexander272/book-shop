import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import { AuthContext } from '../../../context/AuthContext'
import { Button } from '../../../Components/Button/Button'
import { Input } from '../../../Components/Input/Input'
import { Toasts } from '../../../Components/Toasts/Toasts'
import { AdminLayout } from '../../../Layout/AdminLayout'
import { Loader } from '../../../Components/Loader/Loader'
import { ErrorLayout } from '../../../Layout/ErrorLayout'
import UpdateUser from '../../../graphql/mutation/updateUserForAdmin'
import GetUser from '../../../graphql/query/getUserById'
import classes from '../../../styles/admin.module.scss'

export default function AdminUsersAdd() {
    const [isOpen, setIsOpen] = useState(false)
    const [form, setForm] = useState({
        name: '',
        email: '',
        isConfirmed: false,
        role: 'user',
    })
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [getUser, { data }] = useLazyQuery(GetUser)
    const [updateUser] = useMutation(UpdateUser)
    const router = useRouter()
    const variantRole = {
        user: 'Пользователь',
        editor: 'Редактор',
        admin: 'Администратор',
    }

    useEffect(() => {
        if (!data) getUser({ variables: { id: router.query.id } })
        if (data) {
            setForm(data.getUser)
        }
    }, [data])

    const auth = useContext(AuthContext)
    if (auth.role !== 'admin' || !auth.isAuthenticated) {
        return <ErrorLayout />
    }

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const clickHandler = () => {
        setIsOpen(!isOpen)
    }

    const changeRoleHandler = event => {
        setIsOpen(false)
        let role = ''
        Object.values(variantRole).forEach((r, index) => {
            if (r === event.target.textContent) role = Object.keys(variantRole)[index]
        })
        setForm({ ...form, role })
    }

    const createHandler = async () => {
        try {
            setLoading(true)
            const res = await updateUser({
                variables: { id: router.query.id, name: form.name, email: form.email, role: form.role },
            })
            setSuccess(res.data.updateUserForAdmin)
            // setTimeout(() => {
            //     setSuccess('')
            // }, 5500)
            router.push('/admin/users/all')

            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setError(e.message.split(': ')[1])
            setTimeout(() => {
                setError('')
            }, 5500)
        }
    }

    return (
        <AdminLayout active="Пользователи">
            {success && <Toasts type={'success'} message={success} />}
            {error && <Toasts type={'error'} message={error} />}
            <div className={classes.container}>
                <h1 className={classes.title}>Редактировать пользователя</h1>
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
                                placeholder={'Никнейм'}
                                onChange={changeHandler}
                            />
                            <Input
                                name={'email'}
                                type={'email'}
                                value={form.email}
                                placeholder={'Email'}
                                onChange={changeHandler}
                            />
                            <p className={classes.listTitle}>
                                Потверждение: {form.isConfirmed ? 'Профиль потвержден' : 'Профиль еще не потвержден'}
                            </p>

                            <div className={classes.list}>
                                <p className={classes.listTitle}>Роль</p>
                                <p onClick={clickHandler} className={classes.currentItem}>
                                    {
                                        Object.values(variantRole)[
                                            Object.keys(variantRole).findIndex(r => r === form.role)
                                        ]
                                    }
                                    <FontAwesomeIcon
                                        className={[classes.listIcon, isOpen ? classes.rotate : null].join(' ')}
                                        icon={faAngleDown}
                                    />
                                </p>
                                <div className={[classes.listVariable, !isOpen ? classes.hidden : null].join(' ')}>
                                    {Object.values(variantRole).map(role => {
                                        return (
                                            <p key={role} onClick={changeRoleHandler} className={classes.item}>
                                                {role}
                                            </p>
                                        )
                                    })}
                                </div>
                            </div>
                            <Button text={'Сохранить'} type="primary" onClick={createHandler} />
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}
