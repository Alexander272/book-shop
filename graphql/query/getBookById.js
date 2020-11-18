import { gql } from '@apollo/client'

export default gql`
    query GetBookByID($id: ID!) {
        getBookById(id: $id) {
            id
            name
            publisher
            annotation
            availability
            author
            series
            theYearOfPublishing
            ISBN
            numberOfPages
            format
            translator
            coverType
            circulation
            weight
            ageRestrictions
            genre
            price
            previewUrl
            previewName
        }
    }
`
