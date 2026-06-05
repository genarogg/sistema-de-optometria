import getCarnetSolvencia from "./getCarnetSolvencia"
import getCarnetEvento from "./getCarnetEvento"
import getCertificado from "./getCertificado"

const resolvers = {
    Query: {
        getCarnetSolvencia,
        getCarnetEvento,
        getCertificado,
    },
    Mutation: {},
};

export default resolvers;
