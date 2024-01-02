import { gql, useMutation } from '@apollo/client';

// Define mutation
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($book: BookInput) {
  saveBook(book: $book) {
   _id
   username
   email
   savedBooks{
    bookId
    authors
    description
    title
    image
    link
   }
  }
}
`;
export const REMOVE_BOOK = gql`
  # Increments a back-end counter and gets its resulting value
  mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      token
      user {
        _id
        username
      }
    }
  }
`;

