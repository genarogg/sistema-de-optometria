import { gql } from "@apollo/client";

const CREAR_EVENTO = gql`
  mutation CrearEvento(
    $token: String!
    $nombre: String!
    $fecha: Date!
    $lugar: String!
    $costo: Int!
    $tipo: TipoEvento!
    $ponentes: [PonenteInput!]
    $descuentoEstudiante: Int
    $descuentoProfesor: Int
    $vigencia: VigenciaEvento
    $aliadoImg: String
    $aliadoNombre: String
  ) {
    crearEvento(
      token: $token
      nombre: $nombre
      fecha: $fecha
      lugar: $lugar
      costo: $costo
      tipo: $tipo
      ponentes: $ponentes
      descuentoEstudiante: $descuentoEstudiante
      descuentoProfesor: $descuentoProfesor
      vigencia: $vigencia
      aliadoImg: $aliadoImg
      aliadoNombre: $aliadoNombre
    ) {
      message
      type
      data {
        id
        nombre
        fecha
        lugar
        costo
        descuentoEstudiante
        descuentoProfesor
        tipo
        vigencia
        aliadoImg
        aliadoNombre
        ponenteEvento {
          id
          usuarioId
          isActivo
          usuario {
            primerNombre
            primerApellido
            cedula
          }
        }
      }
    }
  }
`;

export default CREAR_EVENTO;