const typeDefs = `#graphql
  type User {
    _id: ID
    username: String
    email: String
    password: String
    bookCount: Int
    savedBooks: [Book]
    token: String  # Added, needed to save books
    user: UserType  # Add this line to include the user field in save books
  }
  type UserType {
  _id: ID
  username: String
  # Add other fields as needed
}
  type Book {
    bookId: String!
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
    bookId: String!
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