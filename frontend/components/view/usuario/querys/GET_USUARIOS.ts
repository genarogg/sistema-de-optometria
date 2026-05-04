import { gql } from "@apollo/client";

const GET_USUARIOS = gql`
  query GetUsuarios($token: String!, $filtro: String) {
    getUsuarios(token: $token, filtro: $filtro) {
      type
      message
      data {
        id
        cedula
        email
        telefono
        primerApellido
        segundoApellido
        primerNombre
        segundoNombre
        numeroGremino
        rol
      }
      meta {
        total
      }
    }
  }
`;

export default GET_USUARIOS;
