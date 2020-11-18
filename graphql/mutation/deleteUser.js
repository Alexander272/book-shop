import { gql } from '@apollo/client'

export default gql`
    mutation DeleteUser($id: ID!) {
        deleteUser(id: $id)
    }
`
