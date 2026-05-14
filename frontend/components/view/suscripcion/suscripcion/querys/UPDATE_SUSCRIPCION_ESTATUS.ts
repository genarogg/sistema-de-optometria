import { gql } from "@apollo/client";

const UPDATE_SUSCRIPCION_ESTATUS = gql`
  mutation UpdateSuscripcionEstatus(
    $token: String!
    $suscripcionId: Int!
    $estatus: EstatusSuscripcion!
  ) {
    updateSuscripcionEstatus(
      token: $token
      suscripcionId: $suscripcionId
      estatus: $estatus
    ) {
      message
      type
    }
  }
`;

export default UPDATE_SUSCRIPCION_ESTATUS;