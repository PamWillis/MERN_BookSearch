import { gql, useQuery } from "@apollo/client";

export const GET_ME = gql`
  query me {
    User {
      _id
      username
      email
      password
      bookCount
      savedBooks {
        bookId
        authors
        image
        description
        title
        link
      }
    }
  }
`;