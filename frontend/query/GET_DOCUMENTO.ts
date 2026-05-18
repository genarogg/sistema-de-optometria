import { gql } from "@apollo/client";

const GET_DOCUMENTO = gql`
  query getDocumento($token: String!, $tipoDeDocumento: TipoDeDocumento!) {
    getDocumento(token: $token, tipoDeDocumento: $tipoDeDocumento) {
      message
      type
      data
    }
  }
`;

export default GET_DOCUMENTO;