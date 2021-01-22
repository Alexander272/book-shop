import Head from 'next/head'
import Router from 'next/router'
import { useState, useContext } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Toasts } from '../Components/Toasts/Toasts'
import { Loader } from '../Components/Loader/Loader'
import { AuthContext } from '../context/AuthContext'
import { CartContext } from '../context/CartContext'
import CreateUser from '../graphql/mutation/createUser'
import Login from '../graphql/mutation/login'
import classes from '../styles/auth.module.scss'

export default function AuthUsers() {
    const auth = useContext(AuthContext)
    const { concatCart } = useContext(CartContext)
    const [active, setActive] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [createUser] = useMutation(CreateUser)
    const [login] = useMutation(Login)
    const [registerState, setRegister] = useState({
        name: '',
        email: '',
        password: '',
    })
    const [loginState, setLogin] = useState({
        email: '',
        password: '',
    })

    const clickHandler = event => {
        setActive(prev => !prev)
    }
    const onRegisterHandler = event => {
        setRegister({ ...registerState, [event.target.name]: event.target.value })
    }
    const onLoginHandler = event => {
        setLogin({ ...loginState, [event.target.name]: event.target.value })
    }

    const onRegister = async event => {
        event.preventDefault()
        try {
            setLoading(true)
            const res = await createUser({ variables: { userInput: { ...registerState, role: 'user' } } })
            setSuccess(res.data.createUser)
            setTimeout(() => {
                setSuccess('')
            }, 5500)
            setRegister({
                name: '',
                email: '',
                password: '',
            })
            setLoading(false)
        } catch (error) {
            setLoadin(false)
            setError(error.message.split(': ')[1])
            setTimeout(() => {
                setError('')
            }, 5500)
        }
    }

    const onLogin = async event => {
        event.preventDefault()
        try {
            setLoading(true)
            const res = await login({ variables: loginState })
            auth.login(res.data.login.token, res.data.login.id, res.data.login.name, res.data.login.role)
            setLoading(false)
            await concatCart(res.data.login.id)
            await Router.push('/')
        } catch (e) {
            setLoading(false)
            setError(e.message.split(': ')[1])
            setTimeout(() => {
                setError('')
            }, 5500)
        }
    }

    return (
        <div className="wrapper">
            <Head>
                <title>Authtorization | Shop-Book</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className="container">
                {success.length > 0 && <Toasts type={'success'} message={success} />}
                {error.length > 0 && <Toasts type={'error'} message={error} />}
                <div className={classes.wrapper}>
                    <div className={[classes.container, active ? classes.rightPanelActive : null].join(' ')}>
                        {loading && (
                            <div className={classes.loader}>
                                <Loader size="md" />
                            </div>
                        )}
                        <div className={[classes.formContainer, classes.signUpContainer].join(' ')}>
                            <form className={classes.form}>
                                <h1 className={classes.h1}>Создать аккаунт</h1>
                                <input
                                    value={registerState.name}
                                    name="name"
                                    onChange={onRegisterHandler}
                                    className={classes.input}
                                    required
                                    type="text"
                                    placeholder="Никнейм"
                                />
                                <input
                                    value={registerState.email}
                                    name="email"
                                    onChange={onRegisterHandler}
                                    className={classes.input}
                                    required
                                    type="email"
                                    placeholder="Email"
                                />
                                <input
                                    value={registerState.password}
                                    name="password"
                                    onChange={onRegisterHandler}
                                    className={classes.input}
                                    required
                                    type="password"
                                    placeholder="Пароль"
                                />
                                <button onClick={onRegister} className={classes.button}>
                                    Зарегистрироваться
                                </button>
                            </form>
                        </div>
                        <div className={[classes.formContainer, classes.signInContainer].join(' ')}>
                            <form className={classes.form}>
                                <h1 className={classes.h1}>Войти</h1>
                                <input
                                    value={loginState.email}
                                    name="email"
                                    onChange={onLoginHandler}
                                    className={classes.input}
                                    required
                                    type="email"
                                    placeholder="Email"
                                />
                                <input
                                    value={loginState.password}
                                    name="password"
                                    onChange={onLoginHandler}
                                    className={classes.input}
                                    required
                                    type="password"
                                    placeholder="Пароль"
                                />
                                {/* <a className={classes.a} href="#">
                                    Забыли пароль?
                                </a> */}
                                <button onClick={onLogin} className={classes.button}>
                                    {' '}
                                    Войти
                                </button>
                            </form>
                        </div>
                        <div className={classes.overlayContainer}>
                            <div className={classes.overlay}>
                                <div className={[classes.overlayPanel, classes.overlayLeft].join(' ')}>
                                    <h1 className={classes.h1}>Добро пожаловать!</h1>
                                    <p className={classes.p}>
                                        Чтобы оставаться на связи с нами, войдите, указав свою личную информацию
                                    </p>
                                    <button
                                        onClick={clickHandler}
                                        className={[classes.button, classes.ghost].join(' ')}
                                    >
                                        Войти
                                    </button>
                                </div>
                                <div className={[classes.overlayPanel, classes.overlayRight].join(' ')}>
                                    <h1 className={classes.h1}>Привет друг!</h1>
                                    <p className={classes.p}>Введите свои личные данные и начните покупки с нами</p>
                                    <button
                                        onClick={clickHandler}
                                        className={[classes.button, classes.ghost].join(' ')}
                                    >
                                        Зарегистрироваться
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
