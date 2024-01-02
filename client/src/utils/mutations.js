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
  # Increments a back-end counter and gets its resulting value
  mutation saveBook(
  $author: [String!]!,
  $description: String!,
  $title: String!,
  $bookId: String!,
  $image: String!,
  $link: String!
) {
  saveBook(
    book: {
      author: $author,
      description: $description,
      title: $title,
      bookId: $bookId,
      image: $image,
      link: $link
    }
  ) {
    token
    user {
      _id
      username
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

