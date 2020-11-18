import App from 'next/app'
import { ApolloProvider } from '@apollo/react-hooks'
import { useApollo } from '../graphql/init/init-apollo'
import { AuthContext } from '../context/AuthContext'
import { CardContext } from '../context/CardContext'
import { useAuth } from '../hooks/auth.hook'
import { useCard } from './../hooks/card.hook'
import { Loader } from '../Components/Loader/Loader'
import '../styles/index.scss'

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS

config.autoAddCss = false

export default function MyApp({ Component, pageProps, session }) {
    const { token, userId, name, role, login, logout } = useAuth(session)
    const { books, addToCard, removeToCard, removeAll, ready } = useCard()
    const isAuthenticated = !!token
    const apolloClient = useApollo(pageProps.initialApolloState, token)

    if (!ready)
        return (
            <div className="loader">
                <Loader size="lg" />
            </div>
        )
    return (
        <AuthContext.Provider value={{ token, userId, name, role, login, logout, isAuthenticated }}>
            <CardContext.Provider value={{ userId, books, addToCard, removeToCard, removeAll }}>
                <ApolloProvider client={apolloClient}>
                    <Component {...pageProps} />
                </ApolloProvider>
            </CardContext.Provider>
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
