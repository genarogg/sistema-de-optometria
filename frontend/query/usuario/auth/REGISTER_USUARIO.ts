import { gql } from "@apollo/client";

const REGISTER_USUARIO = gql`
  mutation RegisterUsuario( 
    $telefono: String!,
    $cedula: String!, 
    $email: String!, 
    $password: String!, 
    $captchaToken: String
    $primerNombre: String!,
    $segundoNombre: String,
    $primerApellido: String!
    $segundoApellido: String,

    ) {
    registerUsuario(
      telefono: $telefono, 
      cedula: $cedula, 
      email: $email, 
      password: $password, 
      captchaToken: $captchaToken,
      primerNombre: $primerNombre,
      segundoNombre: $segundoNombre,
      primerApellido: $primerApellido,
      segundoApellido: $segundoApellido,

    ) {
      type
      message
      data {
        token
      }
    }
  }
`;

export default REGISTER_USUARIO;
