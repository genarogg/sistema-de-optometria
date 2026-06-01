
import crearEvento from "./crearEvento";
import actualizarEvento from "./actualizarEvento";
import getEventos from "./getEventos";
import getEventosActivos from "./getEventosActivos";
import getSuscripcionesEvento from "./getSuscripcionesEvento";
import actualizarSuscripcionEventoEstatus from "./actualizarSuscripcionEventoEstatus";
import suscribirseEvento from "./suscribirseEvento";

const resolvers = {
    Query: {
        getEventos,
        getEventosActivos,
        getSuscripcionesEvento,
    },
    Mutation: {
        crearEvento,
        actualizarEvento,
        actualizarSuscripcionEventoEstatus,
        suscribirseEvento,
    },
};

export default resolvers;
