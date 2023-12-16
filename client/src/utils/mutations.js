import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
       email
        password
      }
    }
  }
`;
export const ADD_USER = gql`
  mutation addProfile($username: String!, $email: String!, $password: String!) {
    addUser(name: $username, email: $email, password: $password) {
      token
      user {
        username
        email
        password
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation createBook($: BookInput!) {
    removeBookInput(BookInput: $BookInput) {
      _bookid
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation removeBook($book: String!) {
    removeBook(book: $book) {
      _bookid
    }
  }
`;