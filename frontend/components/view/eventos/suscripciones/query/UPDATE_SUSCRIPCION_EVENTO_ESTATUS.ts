import { gql } from "@apollo/client";

const UPDATE_SUSCRIPCION_EVENTO_ESTATUS = gql`
  mutation UpdateSuscripcionEventoEstatus(
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
      data {
        id
        estatus
        evento {
          id
          nombre
        }
        usuario {
          id
          primerNombre
          primerApellido
        }
      }
    }
  }
`;

export default UPDATE_SUSCRIPCION_EVENTO_ESTATUS;
