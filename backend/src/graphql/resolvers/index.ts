
import demoResolvers from "./demo";
import usuarioResolver from "./usuario";
import bitacoraResolver from "./bitacora";
import suscripcionResolver from "./suscripcion";
import documentoResolver from "./documentos";
import eventoResolver from "./evento";
import { numberScalar } from "../scalar";

const resolvers = {
    Number: numberScalar,
    Query: {
        ...demoResolvers.Query,
        ...usuarioResolver.Query,
        ...bitacoraResolver.Query,
        ...suscripcionResolver.Query,
        ...documentoResolver.Query,
        ...eventoResolver.Query,
    },

    Mutation: {
        ...usuarioResolver.Mutation,
        ...bitacoraResolver.Mutation,
        ...suscripcionResolver.Mutation,
        ...eventoResolver.Mutation,
    },
};

export default resolvers;