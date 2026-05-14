import { gql } from "@apollo/client";

const GET_SUSCRIPCIONES = gql`
  query GetSuscripciones($token: String!, $filtro: String, $pagina: Int) {
    getSuscripciones(token: $token, filtro: $filtro, pagina: $pagina) {
      type
      message
      data {
        id
        comprobante
        comprobanteImg
        contodesuscripcion
        estatus
        createdAt
        planSuscripcion {
          tipo
        }
        usuario {
          cedula
          rol
          primerNombre
          primerApellido
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

export default GET_SUSCRIPCIONES;