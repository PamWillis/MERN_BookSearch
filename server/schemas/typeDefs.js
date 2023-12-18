const typeDefs = `#graphql
  type User {
    _id: ID
    username: String
    email: String
    password: String
    bookCount: Int
  }
  type Book {
    _bookid: Int
    author: [String]
    description: String
    title: String
    image: String
    link: String
  }
  type Auth {
    token: String
    user: User
  }
  type AuthenticationError {
  message: String!
  code: String!
}
  input BookInput {
    author: [String!]!
    description: String!
    title: String!
    _bookid: Int!
    image: String!
    link: String!
  }

  type Query {
    me: User
  }
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addBook(book: BookInput!): User
    removeBook(_bookid: Int!): User
  }
  `;

module.exports = typeDefs;