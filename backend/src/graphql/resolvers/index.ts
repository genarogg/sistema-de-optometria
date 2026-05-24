
import demoResolvers from "./demo";
import usuarioResolver from "./usuario";
import bitacoraResolver from "./bitacora";
import suscripcionResolver from "./suscripcion";
import documentoResolver from "./documentos";
import { numberScalar, MoneyScalar } from "../scalar";

const resolvers = {
    Number: numberScalar,
    Money: MoneyScalar,
    // 
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