import { gql } from '@apollo/client'

export default gql`
    mutation CreateUser($userInput: UserInput!) {
        createUser(userInput: $userInput)
    }
`
