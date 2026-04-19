import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@fn";
import { Usuario } from "@prisma/client"

const verificarToken = async (token: string): Promise<Usuario | null> => {
    const JWTSECRETO = process.env.JWTSECRETO || "jwt-secret";

    try {
        const payload = jwt.verify(token, JWTSECRETO) as JwtPayload;

        if (!payload?.id) {
            console.error("Token inválido o sin ID");
            return null;
        }

        const usuario = await prisma.usuario.findUnique({
            where: { id: payload.id },
        });

        if (!usuario) {
            console.error("Usuario no encontrado");
            return null;
        }

        return usuario;

    } catch (err) {
        console.error("Error al verificar el token:", err);
        return null;
    }
};

export default verificarToken;