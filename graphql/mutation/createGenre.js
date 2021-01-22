import { gql } from '@apollo/client'

export default gql`
    mutation AddGenres($name: String!, $engName: String!) {
        addGenres(name: $name, engName: $engName)
    }
`
