import App from 'next/app'
import { ApolloProvider } from '@apollo/react-hooks'
import { useApollo } from '../graphql/init/init-apollo'
import { AuthContext } from '../context/AuthContext'
import { CartContext } from '../context/CartContext'
import { useAuth } from '../hooks/auth.hook'
import { useCart } from '../hooks/cart.hook'
import '../styles/index.scss'

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS

config.autoAddCss = false

export default function MyApp({ Component, pageProps, session }) {
    const { token, userId, name, role, login, logout } = useAuth(session)
    const isAuthenticated = !!token
    const apolloClient = useApollo(pageProps.initialApolloState, token)
    const { books, addToCart, removeToCart, removeAll, removeBook, concatCart } = useCart(apolloClient, userId)

    return (
        <AuthContext.Provider value={{ token, userId, name, role, login, logout, isAuthenticated }}>
            <CartContext.Provider value={{ userId, books, addToCart, removeToCart, removeAll, removeBook, concatCart }}>
                <ApolloProvider client={apolloClient}>
                    <Component {...pageProps} />
                </ApolloProvider>
            </CartContext.Provider>
        </AuthContext.Provider>
    )
}

MyApp.getInitialProps = async appContext => {
    let session = {
        token: null,
        userId: null,
        name: null,
        role: null,
    }
    if (appContext.ctx.req && appContext.ctx.req.session)
        session = {
            token: appContext.ctx.req.session.token,
            userId: appContext.ctx.req.session.userId,
            name: appContext.ctx.req.session.name,
            role: appContext.ctx.req.session.role,
        }

    const appProps = await App.getInitialProps(appContext)
    return { ...appProps, session }
}
