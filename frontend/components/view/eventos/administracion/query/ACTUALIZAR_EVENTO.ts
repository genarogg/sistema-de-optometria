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
    $descuentoAgremiado: Int
    $vigencia: VigenciaEvento
    $ponentes: [PonenteInput!]
    $aliadoInstitucionImg: String
    $aliadoInstitucionNombre: String
    $aliadoAutorizoFirmaImg: String
    $aliadoAutorizoNombreFirma: String
    $aliadoAutorizoCargo: String
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
      descuentoAgremiado: $descuentoAgremiado
      vigencia: $vigencia
      ponentes: $ponentes
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

export default ACTUALIZAR_EVENTO;