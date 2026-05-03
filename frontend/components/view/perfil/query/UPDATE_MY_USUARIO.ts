import { gql } from "@apollo/client";

const UPDATE_MY_USUARIO = gql`
  mutation UpdateMyUsuario(
    $token: String!
    $avatar: String
    $email: String
    $telefono: String
    $primerNombre: String
    $segundoNombre: String
    $primerApellido: String
    $segundoApellido: String
    $numeroGremino: Int
  ) {
    updateMyUsuario(
      token: $token
      avatar: $avatar
      email: $email
      telefono: $telefono
      primerNombre: $primerNombre
      segundoNombre: $segundoNombre
      primerApellido: $primerApellido
      segundoApellido: $segundoApellido
      numeroGremino: $numeroGremino
    ) {
      type
      message
    }
  }
`;

export default UPDATE_MY_USUARIO;