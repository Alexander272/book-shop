import React, { useContext } from 'react'
import { AdminLayout } from '../../Layout/AdminLayout'
import { ErrorLayout } from '../../Layout/ErrorLayout'
import { AuthContext } from '../../context/AuthContext'
import classes from '../../styles/admin.module.scss'

export default function AdminPage() {
    const auth = useContext(AuthContext)
    if (auth.role === 'user' || !auth.isAuthenticated) {
        return <ErrorLayout />
    }

    return (
        <AdminLayout active="Статистика">
            <div className={classes.container}>Admin Page</div>
        </AdminLayout>
    )
}
