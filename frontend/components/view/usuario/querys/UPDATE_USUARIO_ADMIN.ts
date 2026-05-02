import { gql } from "@apollo/client";

const UPDATE_USUARIO_ADMIN = gql`
  mutation UpdateUsuarioAdmin(
    $usuarioId: Int!
    $token: String!
    $primerNombre: String
    $primerApellido: String
    $telefono: String
    $cedula: String
    $email: String
    $password: String
    $rol: Rol
  ) {
    updateUsuarioAdmin(
      usuarioId: $usuarioId
      token: $token
      primerNombre: $primerNombre
      primerApellido: $primerApellido
      telefono: $telefono
      cedula: $cedula
      email: $email
      password: $password
      rol: $rol
    ) {
      type
      message
    }
  }
`;

export default UPDATE_USUARIO_ADMIN;
