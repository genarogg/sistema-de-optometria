import { gql } from "@apollo/client";

const GET_PLANES = gql`
  query GetPlanes($token: String!) {
    getPlanes(token: $token) {
      message
      type
      data {
        id
        costo
        tipo
      }
    }
  }
`;

export default GET_PLANES;