import { gql } from '@apollo/client'

export default gql`
    mutation DeleteBook($id: ID!) {
        deleteBook(id: $id)
    }
`
