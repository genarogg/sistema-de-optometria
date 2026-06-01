import { gql } from "@apollo/client";

const GET_EVENTOS_ACTIVOS = gql`
  query GetEventosActivos($token: String!) {
    getEventosActivos(token: $token) {
      type
      message
      data {
        id
        nombre
        fecha
        lugar
        costo
        descuentoEstudiante
        descuentoProfesor
        tipo
        vigencia
        ponenteEvento {
          id
          usuarioId
          isActivo
          usuario {
            primerNombre
            primerApellido
            cedula
          }
        }
        suscripcionEvento {
          id
          usuarioId
        }
      }
    }
  }
`;

export default GET_EVENTOS_ACTIVOS;