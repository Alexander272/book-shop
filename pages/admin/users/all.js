import { useState, useEffect, useContext } from 'react'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { AdminLayout } from '../../../Layout/AdminLayout'
import { Loader } from '../../../Components/Loader/Loader'
import { Toasts } from '../../../Components/Toasts/Toasts'
import { AuthContext } from '../../../context/AuthContext'
import { ErrorLayout } from '../../../Layout/ErrorLayout'
import GetAllUsers from '../../../graphql/query/getAllUsers'
import DeleteUser from '../../../graphql/mutation/deleteUser'
import classes from '../../../styles/admin.module.scss'

export default function AdminUsersAll() {
    const [users, setUsers] = useState(null)
    const [loadingDel, setLoadingDel] = useState(false)
    const [success, setSuccess] = useState('')
    const [errorDel, setErrorDel] = useState('')
    const [getUsers, { loading, error, data, called }] = useLazyQuery(GetAllUsers)
    const [deleteUserById] = useMutation(DeleteUser)

    useEffect(() => {
        if (!error && !users) getUsers()
        if (data) {
            setUsers(data.getAllUsers)
        }
    }, [loading, called])

    const auth = useContext(AuthContext)
    if (auth.role !== 'admin' || !auth.isAuthenticated) {
        return <ErrorLayout />
    }

    const deleteUser = async event => {
        const id = event.target.dataset.id
        try {
            setLoadingDel(true)
            const res = await deleteUserById({ variables: { id } })
            setSuccess(res.data.deleteUser)

            setUsers(prevState => prevState.filter(user => user.id != id))

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
        <AdminLayout active="Пользователи">
            <div className={classes.container}>
                {success.length > 0 && <Toasts type={'success'} message={success} />}
                {errorDel.length > 0 && <Toasts type={'error'} message={errorDel} />}
                <h1 className={classes.title}>Все пользователи</h1>
                <div className={classes.form}>
                    {loading || loadingDel ? (
                        <div className={classes.loader}>
                            <Loader size="md" />
                        </div>
                    ) : (
                        <>
                            {users &&
                                users.map(user => {
                                    return (
                                        <div key={user.id} className={classes.itemList}>
                                            <div>
                                                <p>Имя пользователя</p>
                                                <p className={classes.bold}>
                                                    <b>{user.name}</b>
                                                </p>
                                            </div>
                                            <div>
                                                <p>email</p>
                                                <p className={classes.bold}>
                                                    <b>{user.email}</b>
                                                </p>
                                            </div>
                                            <div>
                                                <p>Роль пользователя</p>
                                                <p className={classes.bold}>
                                                    <b>{user.role}</b>
                                                </p>
                                            </div>
                                            <div onClick={deleteUser} data-id={user.id} className={classes.trashIcon}>
                                                <FontAwesomeIcon className={classes.deleteIcon} icon={faTrashAlt} />
                                            </div>
                                        </div>
                                    )
                                })}
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}
