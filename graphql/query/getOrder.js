import { gql } from '@apollo/client'

export default gql`
    query GetOrder($id: ID!) {
        getOrder(id: $id) {
            id
            book {
                bookId
                name
                number
                price
            }
            dateOfOrders
        }
    }
`
