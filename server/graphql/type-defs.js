const { gql } = require('@apollo/client')

const typeDefs = gql`
    type Items {
        items: [Cart]
    }
    type Cart {
        id: ID
        count: Int
        bookId: Book
    }
    type User {
        id: ID
        name: String
        email: String
        role: String
        token: String
        isConfirmed: Boolean
        cart: Items
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
    type bookType {
        bookId: ID
        name: String
        number: Int
        price: Int
    }
    type Statistics {
        books: [bookType]
        subscribers: Int
        totalPurchases: Int
        allPrice: Int
    }
    type Order {
        id: ID
        userId: ID
        book: [bookType]
        dateOfOrders: String
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
        name: String
        count: Int
        price: Int
    }
    input OrderInput {
        userId: ID
        book: [book]
    }
    input CartInput {
        count: Int
        bookId: ID
    }

    type Query {
        getAllUsers: [User!]
        getBooks: [Book!]
        getBookById(id: ID!): Book
        getStatistics: Statistics
        getOrder(id: ID!): [Order]
        getUser(id: ID!): User
        getUserCart(id: ID!): User
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
        addSubscribers(email: String): String
        updateUser(id: ID, email: String, name: String, password: String, newPassword: String): String
        addUserCart(id: ID!, bookId: ID!): String
        addAllUserCart(id: ID!, cart: [CartInput]): String
        removeUserCart(id: ID!, bookId: ID!): String
        removeBookUserCart(id: ID!, bookId: ID!): String
        removeAllUserCart(id: ID!): String
    }
`
module.exports = typeDefs
