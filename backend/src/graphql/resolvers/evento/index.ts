
import crearEvento from "./crearEvento";
import actualizarEvento from "./actualizarEvento";
import getEventos from "./getEventos";

const resolvers = {
    Query: {
        getEventos,
    },
    Mutation: {
        crearEvento,
        actualizarEvento,
    },
};

export default resolvers;
