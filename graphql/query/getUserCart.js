import { gql } from '@apollo/client'

export default gql`
    query GetUserCart($id: ID!) {
        getUserCart(id: $id) {
            cart {
                items {
                    id
                    count
                    bookId {
                        id
                        name
                        author
                        previewUrl
                        price
                    }
                }
            }
        }
    }
`
