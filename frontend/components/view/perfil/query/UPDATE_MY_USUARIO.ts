import { gql } from "@apollo/client";

const UPDATE_MY_USUARIO = gql`
  mutation UpdateMyUsuario(
    $token: String!
    $avatar: String
    $email: String
    $telefono: String
    $primerNombre: String
    $primerApellido: String
  ) {
    updateMyUsuario(
      token: $token
      avatar: $avatar
      email: $email
      telefono: $telefono
      primerNombre: $primerNombre
      primerApellido: $primerApellido
    ) {
      type
      message
    }
  }
`;

export default UPDATE_MY_USUARIO;