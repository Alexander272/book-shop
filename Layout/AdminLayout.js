import React from 'react'
import Head from 'next/head'
import { AdminNavbar } from '../Components/AdminNavbar/AdminNavbar'
import classes from '../styles/admin.module.scss'

export const AdminLayout = ({ children, title = 'App', active = 'Статистика', description = undefined }) => {
    return (
        <div className="wrapper">
            <Head>
                <title>{title} | Shop-Book</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content={description} />
            </Head>
            <div className="container">
                <div className={classes.content}>
                    <AdminNavbar active={active} />
                    {children}
                </div>
            </div>
        </div>
    )
}
