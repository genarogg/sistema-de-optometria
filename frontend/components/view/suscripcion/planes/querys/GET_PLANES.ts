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
        isActivo
      }
    }
  }
`;

export default GET_PLANES;
