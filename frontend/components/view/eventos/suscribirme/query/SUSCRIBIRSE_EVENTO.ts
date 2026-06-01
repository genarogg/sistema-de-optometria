import { gql } from "@apollo/client";

const SUSCRIBIRSE_EVENTO = gql`
  mutation SuscribirseEvento(
    $token: String!
    $eventoId: Int!
    $comprobante: String!
    $comprobanteImg: String!
  ) {
    suscribirseEvento(
      token: $token
      eventoId: $eventoId
      comprobante: $comprobante
      comprobanteImg: $comprobanteImg
    ) {
      message
      type
    }
  }
`;

export default SUSCRIBIRSE_EVENTO;