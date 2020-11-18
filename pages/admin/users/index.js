import React, { useContext } from 'react'
import { faPlusCircle, faUser } from '@fortawesome/free-solid-svg-icons'
import { AdminLink } from '../../../Components/AdminLink/AdminLink'
import { AdminLayout } from '../../../Layout/AdminLayout'
import { ErrorLayout } from '../../../Layout/ErrorLayout'
import { AuthContext } from '../../../context/AuthContext'
import classes from '../../../styles/admin.module.scss'

export default function AdminUsers() {
    const auth = useContext(AuthContext)
    if (auth.role !== 'admin' || !auth.isAuthenticated) {
        return <ErrorLayout />
    }

    return (
        <AdminLayout active="Пользователи">
            <div className={classes.container}>
                <h1 className={classes.title}>Пользователи</h1>
                <AdminLink link="/admin/users/add" text="Добавить пользователя" icon={faPlusCircle} />
                <AdminLink link="/admin/users/all" text="Список пользователей" icon={faUser} />
            </div>
        </AdminLayout>
    )
}
