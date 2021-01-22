import { gql } from '@apollo/client'

export default gql`
    mutation AddUserCart($id: ID!, $bookId: ID!) {
        addUserCart(id: $id, bookId: $bookId)
    }
`
