
import demoResolvers from "./demo";
import usuarioResolver from "./usuario";
import bitacoraResolver from "./bitacora";
import suscripcionResolver from "./suscripcion";
import documentoResolver from "./documentos";
import NumberScalar from "./scalar/numberScalar";

const resolvers = {
    Number: NumberScalar,
    Query: {
        ...demoResolvers.Query,
        ...usuarioResolver.Query,
        ...bitacoraResolver.Query,
        ...suscripcionResolver.Query,
        ...documentoResolver.Query,
    },

    Mutation: {
        ...usuarioResolver.Mutation,
        ...bitacoraResolver.Mutation,
        ...suscripcionResolver.Mutation,
    },
};

export default resolvers;