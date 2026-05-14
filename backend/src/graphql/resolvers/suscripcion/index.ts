import getPlanes from "./planes/getPlanes";
import crearPlan from "./planes/crearPlan";
import updatePlan from "./planes/updatePlan";
import crearSuscripcion from "./suscripcion/crearSuscripcion";
import updateSuscripcionEstatus from "./suscripcion/updateSuscripcionEstatus";
import getSuscripciones from "./suscripcion/getSuscripciones";

const resolvers = {
    Query: {
        getPlanes,
        getSuscripciones,
    },
    Mutation: {
        crearPlan,
        updatePlan,
        crearSuscripcion,
        updateSuscripcionEstatus,
    },
};

export default resolvers;
