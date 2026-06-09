import { gql } from "@apollo/client";

const GET_SUSCRIPCIONES = gql`
  query GetSuscripciones($token: String!, $filtro: String, $pagina: Int, $estatus: String) {
    getSuscripciones(token: $token, filtro: $filtro, pagina: $pagina, estatus: $estatus) {
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
          costo
        }
        usuario {
          cedula
          rol
          primerNombre
          primerApellido
          segundoApellido
          segundoNombre
          email
          telefono
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
