import { gql } from '@apollo/client'

export default gql`
    mutation AddSubscribers($email: String) {
        addSubscribers(email: $email)
    }
`
