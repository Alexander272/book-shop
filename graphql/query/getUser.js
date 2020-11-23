import { gql } from '@apollo/client'

export default gql`
    query GetUser($id: ID!) {
        getUser(id: $id) {
            id
            email
            name
        }
    }
`
