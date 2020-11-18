import React, { useContext, useState } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { useMutation } from '@apollo/react-hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen, faShoppingBasket, faSignInAlt, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons'
import { SearchInput } from './SearchInput/SearchInput'
import { AuthContext } from '../context/AuthContext'
import { CardContext } from './../context/CardContext'
import Logout from '../graphql/mutation/logout'

export const Header = ({ active }) => {
    const auth = useContext(AuthContext)
    const card = useContext(CardContext)
    const [open, setOpen] = useState(false)
    const [logout, { client }] = useMutation(Logout)

    const openHandler = () => {
        setOpen(prev => !prev)
    }

    const LogoutHandler = async () => {
        await logout()
        auth.logout()
        await client.clearStore()
        await Router.push('/')
    }

    return (
        <header>
            <div className="header-top">
                <Link href="/contacts">
                    <a className="header__contacts header__darken">
                        <FontAwesomeIcon icon={faEnvelope} className="header-top__icon" />
                        Обратная связь
                    </a>
                </Link>
                {auth.isAuthenticated ? (
                    <div className="header__profile">
                        <p onClick={openHandler} className="header__contacts">
                            <FontAwesomeIcon icon={faUser} className="header-top__icon" />
                            {auth.name}
                        </p>
                        <div className={['profile__listLink', open ? null : 'h0'].join(' ')}>
                            <Link href="/profile">
                                <a className="header__contacts profile__link">Профиль</a>
                            </Link>
                            <Link href="/orders">
                                <a className="header__contacts profile__link">Заказы</a>
                            </Link>
                            <p onClick={LogoutHandler} className="header__contacts profile__link">
                                Выйти
                            </p>
                        </div>
                    </div>
                ) : (
                    <Link href="/auth">
                        <a className="header__contacts">
                            <FontAwesomeIcon icon={faSignInAlt} className="header-top__icon" />
                            Войти
                        </a>
                    </Link>
                )}
            </div>
            <div className="header">
                <Link href="/">
                    <a className="header__logo">
                        <FontAwesomeIcon icon={faBookOpen} className="header__icon" />
                        <span className="header__title">BookShop</span>
                    </a>
                </Link>
                {/* <SearchInput /> */}
                <div className="header__card-container">
                    <Link href="/card">
                        <a className="header__card">
                            <FontAwesomeIcon icon={faShoppingBasket} className="header__card-icon" />
                        </a>
                    </Link>
                    <div className="header__card-text">
                        <Link href="/card">
                            <a className="header__card-link">
                                <b>Корзина{card.books.length > 0 ? ': ' + card.books.length : null}</b>
                            </a>
                        </Link>
                        {/* <Link href="/card#bookmarks">
                            <a className="header__card-link">Закладки 0</a>
                        </Link> */}
                    </div>
                </div>
            </div>
        </header>
    )
}
