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
    $descuentoAgremiado: Int
    $vigencia: VigenciaEvento
    $aliadoInstitucionImg: String
    $aliadoInstitucionNombre: String
    $aliadoAutorizoFirmaImg: String
    $aliadoAutorizoNombreFirma: String
    $aliadoAutorizoCargo: String
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
      descuentoAgremiado: $descuentoAgremiado
      vigencia: $vigencia
      aliadoInstitucionImg: $aliadoInstitucionImg
      aliadoInstitucionNombre: $aliadoInstitucionNombre
      aliadoAutorizoFirmaImg: $aliadoAutorizoFirmaImg
      aliadoAutorizoNombreFirma: $aliadoAutorizoNombreFirma
      aliadoAutorizoCargo: $aliadoAutorizoCargo
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
        descuentoAgremiado
        tipo
        vigencia
        aliadoInstitucionImg
        aliadoInstitucionNombre
        aliadoAutorizoFirmaImg
        aliadoAutorizoNombreFirma
        aliadoAutorizoCargo
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