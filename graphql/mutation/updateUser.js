import { gql } from '@apollo/client'

export default gql`
    mutation UpdateUser($id: ID, $email: String, $name: String, $password: String, $newPassword: String) {
        updateUser(id: $id, email: $email, name: $name, password: $password, newPassword: $newPassword)
    }
`
