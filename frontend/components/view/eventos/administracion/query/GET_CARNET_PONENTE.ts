import { gql } from "@apollo/client";

const GET_CARNET_PONENTE = gql`
  query getCarnetEvento($token: String!, $usuarioId: Int, $eventoId: Int!) {
    getCarnetEvento(token: $token, usuarioId: $usuarioId, eventoId: $eventoId) {
      message
      type
      data
    }
  }
`;

export default GET_CARNET_PONENTE;
