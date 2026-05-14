import { gql } from "@apollo/client";

const UPDATE_PLAN = gql`
  mutation UpdatePlan(
    $token: String!
    $planId: Int!
    $costo: Int
    $tipo: String
    $isActivo: Boolean
  ) {
    updatePlan(
      token: $token
      planId: $planId
      costo: $costo
      tipo: $tipo
      isActivo: $isActivo
    ) {
      message
      type
    }
  }
`;

export default UPDATE_PLAN;
