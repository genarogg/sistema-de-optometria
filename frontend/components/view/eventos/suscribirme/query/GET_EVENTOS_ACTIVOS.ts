import { gql } from "@apollo/client";

const GET_EVENTOS_ACTIVOS = gql`
  query GetEventosActivos(
    $token: String!
    $page: Int
    $pageSize: Int
    $filtro: String
    $tipo: TipoEvento
  ) {
    getEventosActivos(
      token: $token
      page: $page
      pageSize: $pageSize
      filtro: $filtro
      tipo: $tipo
    ) {
      type
      message
      data {
        eventos {
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
        suscripcionesEventoUsuario {
          id
          eventoId
          estatus
        }
      }
      meta {
        total
        page
        limit
      }
    }
  }
`;

export default GET_EVENTOS_ACTIVOS;
