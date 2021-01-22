import { gql } from '@apollo/client'

export default gql`
    mutation RemoveBookUserCart($id: ID!, $bookId: ID!) {
        removeBookUserCart(id: $id, bookId: $bookId)
    }
`
