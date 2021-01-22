import { gql } from '@apollo/client'

export default gql`
    mutation AddAllUserCart($id: ID!, $cart: [CartInput]) {
        addAllUserCart(id: $id, cart: $cart)
    }
`
