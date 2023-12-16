import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me {
username
email
bookCount
user:id
    }
  }
`;