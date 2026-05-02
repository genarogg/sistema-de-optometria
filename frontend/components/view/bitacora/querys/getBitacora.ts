import { gql } from "@apollo/client";

const GET_BITACORA = gql`
  query GetBitacora(
    $token: String!
    $page: Int
    $rol: Rol
    $accion: AccionesBitacora
    $searchTerm: String
  ) {
    getBitacora(
      token: $token
      page: $page
      rol: $rol
      accion: $accion
      searchTerm: $searchTerm
    ) {
      type
      message
      meta {
        page
        total
      }
      data {
        fecha
        id
        mensaje
        type
        usuario {
          email
          cedula
          primerNombre
          primerApellido
          rol
        }
      }
    }
  }
`;

export default GET_BITACORA;
