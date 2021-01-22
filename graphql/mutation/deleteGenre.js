import { gql } from '@apollo/client'

export default gql`
    mutation RemoveGenre($id: ID!) {
        removeGenre(id: $id)
    }
`
