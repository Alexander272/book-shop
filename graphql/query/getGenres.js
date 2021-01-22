import { gql } from '@apollo/client'

export default gql`
    query GetGenres {
        getGenres {
            id
            name
            engName
        }
    }
`
