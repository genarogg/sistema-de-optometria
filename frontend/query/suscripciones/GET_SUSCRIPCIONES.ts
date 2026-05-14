import { gql } from "@apollo/client";

const GET_SUSCRIPCIONES = gql`
  query GetSuscripciones($token: String!) {
    getSuscripciones(token: $token) {
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
    }
  }
`;

export default GET_SUSCRIPCIONES;