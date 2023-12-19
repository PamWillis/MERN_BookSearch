const typeDefs = `#graphql
  type User {
    _id: ID
    username: String
    email: String
    password: String
    bookCount: Int
    savedBooks: [Book]
  }
  type Book {
    bookId: Int
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

  input BookInput {
    author: [String!]!
    description: String!
    title: String!
    bookId: Int!
    image: String!
    link: String!
  }

  type Query {
    me: User!
  }
  
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(book: BookInput!): User
    removeBook(bookId: Int!): User
  }
  `;

module.exports = typeDefs;