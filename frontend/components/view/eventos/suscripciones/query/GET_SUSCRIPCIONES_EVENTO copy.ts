import { gql } from "@apollo/client";

const ACTUALIZAR_SUSCRIPCION_EVENTO_ESTATUS = gql`
  mutation ActualizarSuscripcionEventoEstatus(
    $token: String!
    $suscripcionEventoId: Int!
    $estatus: EstatusPagoEvento!
  ) {
    actualizarSuscripcionEventoEstatus(
      token: $token
      suscripcionEventoId: $suscripcionEventoId
      estatus: $estatus
    ) {
      type
      message
    }
  }
`;

export default ACTUALIZAR_SUSCRIPCION_EVENTO_ESTATUS;