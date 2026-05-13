import demoResolvers from "./demo";
import usuarioResolver from "./usuario";
import bitacoraResolver from "./bitacora";
import suscripcionResolver from "./suscripcion";

const resolvers = {
    ...demoResolvers,
    ...usuarioResolver,
    ...bitacoraResolver,
    ...suscripcionResolver,
};

export default resolvers;