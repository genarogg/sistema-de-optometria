import { gql } from "@apollo/client";

const GET_BITACORA = gql`
  query GetBitacora(
    $token: String!
    $page: Int
    $rol: Rol
    $acciones: AccionesBitacora
    $searchTerm: String
  ) {
    getBitacora(
      token: $token
      page: $page
      rol: $rol
      acciones: $acciones
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
        }
      }
    }
  }
`;

export default GET_BITACORA;