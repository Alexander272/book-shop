import { useContext, useState } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { useMutation } from '@apollo/react-hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faPlusCircle, faHome, faSignOutAlt, faUser, faChartBar } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../../context/AuthContext'
import Logout from '../../graphql/mutation/logout'
import classes from './adminNavbar.module.scss'

export const AdminNavbar = ({ active }) => {
    const auth = useContext(AuthContext)
    const [logout, { client }] = useMutation(Logout)

    const LogoutHandler = async () => {
        await logout()
        auth.logout()
        await client.clearStore()
        await Router.push('/')
    }

    return (
        <nav className={classes.nav}>
            <Link href={'/'}>
                <a className={classes.link}>
                    <FontAwesomeIcon icon={faHome} className={classes.icon} />
                    Главная
                </a>
            </Link>
            <Link href={'/admin'}>
                <a className={[classes.link, active === 'Статистика' ? classes.active : null].join(' ')}>
                    <FontAwesomeIcon icon={faChartBar} className={classes.icon} />
                    Статистика
                </a>
            </Link>
            <Link href={'/admin/add'}>
                <a className={[classes.link, active === 'Добавить' ? classes.active : null].join(' ')}>
                    <FontAwesomeIcon icon={faPlusCircle} className={classes.icon} />
                    Добавить
                </a>
            </Link>
            <Link href={'/admin/edit'}>
                <a className={[classes.link, active === 'Редактировать' ? classes.active : null].join(' ')}>
                    <FontAwesomeIcon icon={faPen} className={classes.icon} />
                    Редактировать
                </a>
            </Link>
            <Link href={'/admin/users'}>
                <a className={[classes.link, active === 'Пользователи' ? classes.active : null].join(' ')}>
                    <FontAwesomeIcon icon={faUser} className={classes.icon} />
                    Пользователи
                </a>
            </Link>
            <p onClick={LogoutHandler} className={classes.link}>
                <FontAwesomeIcon icon={faSignOutAlt} className={classes.icon} />
                Выйти из системы
            </p>
        </nav>
    )
}
