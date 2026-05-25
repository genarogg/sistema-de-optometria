import getCarnetSolvencia from "./getCarnetSolvencia"
import getCarnetEvento from "./getCarnetEvento"

const resolvers = {
    Query: {
        getCarnetSolvencia,
        getCarnetEvento,
    },
    Mutation: {},
};

export default resolvers;
