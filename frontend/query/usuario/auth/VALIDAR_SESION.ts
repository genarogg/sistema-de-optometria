import { gql } from "@apollo/client";

const VALIDAR_SESION = gql`
  query validarSesion($token: String!) {
    validarSesion(token: $token) {
      data {
        rol
      }
    }
  }
`;

export default VALIDAR_SESION;
