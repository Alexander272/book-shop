import { gql } from '@apollo/client'

export default gql`
    mutation RemoveAllUserCart($id: ID!) {
        removeAllUserCart(id: $id)
    }
`
