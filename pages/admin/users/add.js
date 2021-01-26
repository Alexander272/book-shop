import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useContext } from 'react'
import { useMutation } from '@apollo/client/react/hooks'
import { AuthContext } from '../../../context/AuthContext'
import { Button } from '../../../Components/Button/Button'
import { Input } from '../../../Components/Input/Input'
import { Toasts } from '../../../Components/Toasts/Toasts'
import { AdminLayout } from '../../../Layout/AdminLayout'
import { Loader } from '../../../Components/Loader/Loader'
import { ErrorLayout } from '../../../Layout/ErrorLayout'
import createUser from '../../../graphql/mutation/createUserToAdmin'
import classes from '../../../styles/admin.module.scss'

export default function AdminUsersAdd() {
    const [isOpen, setIsOpen] = useState(false)
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
    })
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [create] = useMutation(createUser)
    const variantRole = {
        user: 'Пользователь',
        editor: 'Редактор',
        admin: 'Администратор',
    }

    const auth = useContext(AuthContext)
    if (auth.role !== 'admin' || !auth.isAuthenticated) {
        return <ErrorLayout />
    }

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const clickHandler = () => {
        setIsOpen(prev => !prev)
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
            const res = await create({ variables: { userInput: form } })
            setSuccess(res.data.createUserToAdmin)
            setTimeout(() => {
                setSuccess('')
            }, 5500)
            setForm({
                name: '',
                email: '',
                password: '',
                role: 'user',
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
        <AdminLayout active="Пользователи">
            {success.length > 0 && <Toasts type={'success'} message={success} />}
            {error.length > 0 && <Toasts type={'error'} message={error} />}
            <div className={classes.container}>
                <h1 className={classes.title}>Добавить пользователя</h1>
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
                            <Input
                                name={'password'}
                                type={'password'}
                                value={form.password}
                                placeholder={'Пароль'}
                                onChange={changeHandler}
                            />
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
                            <Button text={'Создать'} type="primary" onClick={createHandler} />
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}
