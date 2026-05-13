import { gql } from "@apollo/client";

const CREAR_SUSCRIPCION = gql`
  mutation CrearSuscripcion(
    $token: String!
    $planId: Int!
    $comprobante: Int!
    $comprobanteImg: String!
  ) {
    crearSuscripcion(
      token: $token
      planId: $planId
      comprobante: $comprobante
      comprobanteImg: $comprobanteImg
    ) {
      type
      message
    }
  }
`;

export default CREAR_SUSCRIPCION;