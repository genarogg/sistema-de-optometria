import { gql } from "@apollo/client";

const ACTUALIZAR_EVENTO = gql`
  mutation ActualizarEvento(
    $token: String!
    $eventoId: Int!
    $nombre: String
    $fecha: Date
    $lugar: String
    $costo: Int
    $tipo: TipoEvento
    $descuentoEstudiante: Int
    $descuentoProfesor: Int
    $vigencia: VigenciaEvento
    $ponentes: [PonenteInput!]
    $aliadoImg: String
    $aliadoNombre: String
  ) {
    actualizarEvento(
      token: $token
      eventoId: $eventoId
      nombre: $nombre
      fecha: $fecha
      lugar: $lugar
      costo: $costo
      tipo: $tipo
      descuentoEstudiante: $descuentoEstudiante
      descuentoProfesor: $descuentoProfesor
      vigencia: $vigencia
      ponentes: $ponentes
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

export default ACTUALIZAR_EVENTO;