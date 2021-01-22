import { gql } from '@apollo/client'

export default gql`
    mutation UpdateUserForAdmin($id: ID!, $email: String, $name: String, $role: String) {
        updateUserForAdmin(id: $id, email: $email, name: $name, role: $role)
    }
`
