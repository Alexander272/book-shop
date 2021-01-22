import { gql } from '@apollo/client'

export default gql`
    mutation UpdateGenre($id: ID!, $name: String!, $engName: String!) {
        updateGenre(id: $id, name: $name, engName: $engName)
    }
`
