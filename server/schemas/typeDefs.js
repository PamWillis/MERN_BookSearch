const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
  }
  type Book {
    _bookid: Int
    author: [String]
    description: String
    title: String
    image: Url
    link: Url
  }
  type Auth {
    token: String
    user: User
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
    username: String
    email: String
    bookCount: Int
   user(id: ID!): User
  }
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addBook(book: BookInput:) User
    removeBook(_bookid: Int!): User
  }
  `;

module.exports = typeDefs;