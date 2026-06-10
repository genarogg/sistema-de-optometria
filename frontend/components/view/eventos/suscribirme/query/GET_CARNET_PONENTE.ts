import { gql } from "@apollo/client";

const GET_CARNET_PONENTE = gql`
  query getCarnetEvento($token: String!, $eventoId: Int!) {
    getCarnetEvento(token: $token, eventoId: $eventoId) {
      message
      type
      data
    }
  }
`;

export default GET_CARNET_PONENTE;
