import { gql } from '@apollo/client'

export default gql`
    mutation CreateOrder($order: OrderInput!) {
        createOrder(order: $order)
    }
`
