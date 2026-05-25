import { gql } from "@apollo/client";

const GET_EVENTOS = gql`
  query GetEventos(
    $token: String!
    $page: Int
    $pageSize: Int
    $filtro: String
    $vigencia: VigenciaEvento
    $tipo: TipoEvento
  ) {
    getEventos(
      token: $token
      page: $page
      pageSize: $pageSize
      filtro: $filtro
      vigencia: $vigencia
      tipo: $tipo
    ) {
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
          isActivo
          usuario {
            primerNombre
            primerApellido
          }
        }
      }
      meta {
        total
        page
        limit
      }
    }
  }
`;

export default GET_EVENTOS;