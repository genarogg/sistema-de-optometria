import { gql } from "@apollo/client";

const CREAR_PLAN = gql`
  mutation CrearPlan(
    $token: String!
    $costo: Int!
    $tipo: TipoSuscripcion!
  ) {
    crearPlan(
      token: $token
      costo: $costo
      tipo: $tipo
    ) {
      message
      type
    }
  }
`;

export default CREAR_PLAN;