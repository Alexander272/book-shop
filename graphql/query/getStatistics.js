import { gql } from '@apollo/client'

export default gql`
    query GetStatistics {
        getStatistics {
            books {
                bookId
                name
                number
                price
            }
            subscribers
            totalPurchases
            allPrice
        }
    }
`
