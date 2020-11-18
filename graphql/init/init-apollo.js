import { useMemo } from 'react'
import { ApolloClient, InMemoryCache } from 'apollo-boost'
import { createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

let apolloClient = null
let token = null

function create(initialState) {
    const httpLink = createHttpLink({
        uri: `http://localhost:5000/api/graphql`,
        credentials: 'same-origin',
    })

    const authLink = setContext((_, { headers }) => {
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : '',
            },
        }
    })

    const isBrowser = typeof window !== 'undefined'
    return new ApolloClient({
        connectToDevTools: isBrowser,
        ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
        link: authLink.concat(httpLink),
        cache: new InMemoryCache().restore(initialState || {}),
    })
}

export function initApollo(initialState) {
    // Make sure to create a new client for every server-side request so that data
    // isn't shared between connections (which would be bad)
    if (typeof window === 'undefined') {
        return create(initialState)
    }
    // Reuse client on the client-side
    if (!apolloClient) {
        apolloClient = create(initialState)
    }
    return apolloClient
}

export function useApollo(initialState, initToken) {
    token = initToken
    const store = useMemo(() => initApollo(initialState), [initialState, initToken])
    return store
}
