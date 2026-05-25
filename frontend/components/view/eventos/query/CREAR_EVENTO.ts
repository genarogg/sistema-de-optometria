import { gql } from "@apollo/client";

const CREAR_EVENTO = gql`
  mutation CrearEvento(
    $token: String!
    $nombre: String!
    $fecha: Date!
    $lugar: String!
    $costo: Int!
    $tipo: TipoEvento!
    $ponentesIds: [Int!]
    $descuentoEstudiante: Int
    $descuentoProfesor: Int
    $vigencia: VigenciaEvento
  ) {
    crearEvento(
      token: $token
      nombre: $nombre
      fecha: $fecha
      lugar: $lugar
      costo: $costo
      tipo: $tipo
      ponentesIds: $ponentesIds
      descuentoEstudiante: $descuentoEstudiante
      descuentoProfesor: $descuentoProfesor
      vigencia: $vigencia
    ) {
      message
      type
    }
  }
`;

export default CREAR_EVENTO;