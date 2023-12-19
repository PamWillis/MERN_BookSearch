import { gql, useQuery } from '@apollo/client';

const GET_ME = gql`
  query GET_ME {
     me {
        user
    }
  }
`;