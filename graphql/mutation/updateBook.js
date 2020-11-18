import { gql } from '@apollo/client'

export default gql`
    mutation UpdateBook($book: BookInput!, $id: ID!) {
        updateBook(book: $book, id: $id)
    }
`
