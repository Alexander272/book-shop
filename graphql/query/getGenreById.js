import { gql } from '@apollo/client'

export default gql`
    query GetGenreById($id: ID!) {
        getGenreById(id: $id) {
            id
            name
            engName
        }
    }
`
