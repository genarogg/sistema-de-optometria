import { gql } from "@apollo/client";

const GET_SOLVENCIA_CARNET = gql`
  query getCarnetSolvencia($token: String!, $tipoDeDocumento: TipoDeDocumento!, $suscripcionId: Int!) {
    getCarnetSolvencia(token: $token, tipoDeDocumento: $tipoDeDocumento, suscripcionId: $suscripcionId) {
      message
      type
      data
    }
  }
`;

export default GET_SOLVENCIA_CARNET;