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
    $password: String
    $rol: Rol
    $numeroGremio: Int
    $nivelAcademico: NivelAcademico
    $firma: String
    $tipoAutoridad: TipoAutoridad
    $vigente: Boolean
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
      password: $password
      rol: $rol
      numeroGremio: $numeroGremio
      nivelAcademico: $nivelAcademico
      firma: $firma
      tipoAutoridad: $tipoAutoridad
      vigente: $vigente
    ) {
      type
      message
    }
  }
`;

export default UPDATE_USUARIO_ADMIN;
