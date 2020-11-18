import { gql } from '@apollo/client'

export default gql`
    query GetAllUsers {
        getAllUsers {
            id
            email
            name
            role
        }
    }
`
