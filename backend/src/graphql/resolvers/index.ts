import demoResolvers from "./demo";
import usuarioResolver from "./usuario";
import bitacoraResolver from "./bitacora";

const resolvers = {
    Query: {
        ...demoResolvers.Query,
        ...usuarioResolver.Query,
        ...bitacoraResolver.Query,
    },

    Mutation: {
        ...usuarioResolver.Mutation,
    },
};

export default resolvers;