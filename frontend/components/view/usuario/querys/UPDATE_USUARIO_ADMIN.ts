import { gql } from "@apollo/client";

const UPDATE_USUARIO_ADMIN = gql`
  mutation UpdateUsuarioAdmin(
    $usuarioId: Int!
    $token: String!
    $primerNombre: String
    $segundoNombre: String
    $primerApellido: String
    $segundoApellido: String
    $telefono: String
    $cedula: String
    $email: String
    $numeroGremino: Int
    $password: String
    $rol: Rol
  ) {
    updateUsuarioAdmin(
      usuarioId: $usuarioId
      token: $token
      primerNombre: $primerNombre
      segundoNombre: $segundoNombre
      primerApellido: $primerApellido
      segundoApellido: $segundoApellido
      telefono: $telefono
      cedula: $cedula
      email: $email
      numeroGremino: $numeroGremino
      password: $password
      rol: $rol
    ) {
      type
      message
    }
  }
`;

export default UPDATE_USUARIO_ADMIN;
