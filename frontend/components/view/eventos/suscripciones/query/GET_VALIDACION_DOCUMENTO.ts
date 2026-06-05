import { gql } from "@apollo/client";

const GET_VALIDACION_DOCUMENTO = gql`
  query GetValidacionDocumento($id: Int!) {
    validacionDocumento(id: $id) {
      message
      type
      data
    }
  }
`;

export default GET_VALIDACION_DOCUMENTO;
