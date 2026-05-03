import { gql } from "@apollo/client";

const GET_MY_USUARIO = gql`
  query GetMyUsuario($token: String!) {
    getMyUsuario(token: $token) {
      message
      type
      data {
        id
        avatar
        cedula
        email
        primerApellido
        segundoApellido
        segundoNombre
        primerNombre
        numeroGremino
        rol
        telefono
      }
    }
  }
`;

export default GET_MY_USUARIO;