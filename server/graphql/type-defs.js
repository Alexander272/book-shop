const { gql } = require('@apollo/client')

const typeDefs = gql`
    type User {
        id: ID
        name: String
        email: String
        role: String
        token: String
    }
    type Book {
        id: ID
        name: String!
        publisher: String!
        annotation: String
        availability: Boolean!
        author: String!
        series: String
        theYearOfPublishing: Int
        ISBN: String
        numberOfPages: Int
        format: String
        translator: String
        coverType: String
        circulation: Int
        weight: String
        ageRestrictions: String
        genre: String
        price: Int!
        previewUrl: String
        previewName: String
    }

    input UserInput {
        name: String
        email: String
        password: String
        role: String
    }
    input BookInput {
        name: String!
        publisher: String!
        annotation: String
        availability: Boolean!
        author: String!
        series: String
        theYearOfPublishing: Int
        ISBN: String
        numberOfPages: Int
        format: String
        translator: String
        coverType: String
        circulation: Int
        weight: String
        ageRestrictions: String
        genre: String
        price: Int!
    }
    input book {
        bookId: ID
        number: Int
    }
    input OrderInput {
        userId: ID
        book: [book]
    }

    type Query {
        getAllUsers: [User!]
        getBooks: [Book!]
        getBookById(id: ID!): Book
    }
    type Mutation {
        createUserToAdmin(userInput: UserInput!): String!
        createUser(userInput: UserInput!): String!
        login(email: String!, password: String!): User!
        deleteUser(id: ID!): String!
        deleteBook(id: ID!): String!
        logout: String!
        createNewBook(book: BookInput!): String!
        updateBook(book: BookInput!, id: ID!): String!
        createOrder(order: OrderInput): String!
    }
`
module.exports = typeDefs
