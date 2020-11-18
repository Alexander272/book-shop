import { gql } from '@apollo/client'

export default gql`
    query GetBooks {
        getBooks {
            id
            name
            author
        }
    }
`
