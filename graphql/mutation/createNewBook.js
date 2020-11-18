import { gql } from '@apollo/client'

export default gql`
    mutation CreateNewBook($book: BookInput!) {
        createNewBook(book: $book)
    }
`
