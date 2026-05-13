import demoResolvers from "./demo";
import usuarioResolver from "./usuario";
import bitacoraResolver from "./bitacora";
import suscripcionResolver from "./suscripcion";

const resolvers = {
    Query: {
        ...demoResolvers.Query,
        ...usuarioResolver.Query,
        ...bitacoraResolver.Query,
        ...suscripcionResolver.Query,
    },

    Mutation: {
        ...usuarioResolver.Mutation,
        ...bitacoraResolver.Mutation,
        ...suscripcionResolver.Mutation,
    },
};

export default resolvers;