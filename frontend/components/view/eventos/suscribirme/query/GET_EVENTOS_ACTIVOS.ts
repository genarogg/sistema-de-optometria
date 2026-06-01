import { gql } from "@apollo/client";

const GET_EVENTOS_ACTIVOS = gql`
  query GetEventosActivos($token: String!) {
    getEventosActivos(token: $token) {
      type
      message
      data {
        costo
        descuentoEstudiante
        descuentoProfesor
        fecha
        id
        lugar
        nombre
        tipo
        vigencia
        ponenteEvento {
          usuario {
            primerApellido
            primerNombre
            gremio {
              nivelAcademico
            }
          }
        }
      }
    }
  }
`;

export default GET_EVENTOS_ACTIVOS;