import getCarnetSolvencia from "./getCarnetSolvencia"
import getCarnetEvento from "./getCarnetEvento"
import getCertificado from "./getCertificado"
import validacionDocumento from "./validacionDocumento"

const resolvers = {
    Query: {
        getCarnetSolvencia,
        getCarnetEvento,
        getCertificado,
        validacionDocumento,
    },
    Mutation: {},
};

export default resolvers;
