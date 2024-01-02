import { gql, useQuery } from "@apollo/client";
export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      email
      password
      bookCount
      savedBooks {
        bookId
        author
        image
        description
        title
        link
      }
    }
  }
`;