
import crearEvento from "./crearEvento";
import actualizarEvento from "./actualizarEvento";
import getEventos from "./getEventos";
import getSuscripcionesEvento from "./getSuscripcionesEvento";
import actualizarSuscripcionEventoEstatus from "./actualizarSuscripcionEventoEstatus";

const resolvers = {
    Query: {
        getEventos,
        getSuscripcionesEvento,
    },
    Mutation: {
        crearEvento,
        actualizarEvento,
        actualizarSuscripcionEventoEstatus,
    },
};

export default resolvers;
