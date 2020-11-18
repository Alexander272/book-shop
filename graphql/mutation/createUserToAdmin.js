import { gql } from '@apollo/client'

export default gql`
    mutation CreateUserToAdmin($userInput: UserInput!) {
        createUserToAdmin(userInput: $userInput)
    }
`
