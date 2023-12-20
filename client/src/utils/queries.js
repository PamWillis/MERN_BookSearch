import { gql, useQuery } from '@apollo/client';

const GET_ME = gql`
query Me {
  me {
    _id
    username
    email
    password
    bookCount
    savedBooks {
      
    }
  }
}
`;