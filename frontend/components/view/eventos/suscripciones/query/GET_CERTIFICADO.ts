import { gql } from "@apollo/client";

const GET_CERTIFICADO = gql`
  query GetCertificado($token: String!, $usuarioId: Int!, $eventoId: Int!) {
    getCertificado(token: $token, usuarioId: $usuarioId, eventoId: $eventoId) {
      message
      type
      data
    }
  }
`;

export default GET_CERTIFICADO;
