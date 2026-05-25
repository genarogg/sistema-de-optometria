import { gql } from "@apollo/client";

const GET_SUSCRIPCIONES_EVENTO = gql`
  query GetSuscripcionesEvento(
    $token: String!
    $page: Int
    $pageSize: Int
    $filtro: String
    $eventoId: Int
    $estatus: EstatusPagoEvento
  ) {
    getSuscripcionesEvento(
      token: $token
      page: $page
      pageSize: $pageSize
      filtro: $filtro
      eventoId: $eventoId
      estatus: $estatus
    ) {
      message
      type
      data {
        id
        comprobante
        comprobanteImg
        estatus
        precioAlSuscripcion
        createdAt
        evento {
          id
          nombre
          tipo
          fecha
          lugar
        }
        usuario {
          id
          cedula
          primerNombre
          segundoNombre
          primerApellido
          segundoApellido
          rol
          telefono
          correo
        }
      }
      meta {
        limit
        page
        total
      }
    }
  }
`;

export default GET_SUSCRIPCIONES_EVENTO;

