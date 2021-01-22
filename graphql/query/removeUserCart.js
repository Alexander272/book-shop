import { gql } from '@apollo/client'

export default gql`
    mutation RemoveUserCart($id: ID!, $bookId: ID!) {
        removeUserCart(id: $id, bookId: $bookId)
    }
`
