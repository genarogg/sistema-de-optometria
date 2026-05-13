import getPlanes from "./planes/getPlanes";
import crearPlan from "./planes/crearPlan";
import updatePlan from "./planes/updatePlan";
import crearSuscripcion from "./crearSuscripcion";
import updateSuscripcionEstatus from "./updateSuscripcionEstatus";
import getSuscripciones from "./getSuscripciones";

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
