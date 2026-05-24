import { prisma } from "@fn";
import seedUsers from "./seedUsers";
import seedGremio from "./seedGremio";
import seedAutoridad from "./seedAutoridad";
import seedEvento from "./seedEvento";
import seedBitacora from "./seedBitacora";
import seedPonenteEvento from "./seedPonenteEvento";
import seedSuscripcionEvento from "./seedSuscripcionEvento";
import seedSuscripcion from "./seedSuscripcion";
import seedSuscripcionDetails from "./seedSuscripcionDetails";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const seed = async () => {
    try {

        const adminUser = await prisma.usuario.findUnique({
            where: { email: "genarrogg@gmail.com" },
        });
        if (adminUser) {
            return "ya plantada"
        }

        console.log("🌱 Iniciando siembra de la base de datos...\n");
        // Nivel 1: Usuarios (sin dependencias)
        await seedUsers();
        await delay(200);
        console.log("");

        // Nivel 2: Dependen de Usuario
        await seedGremio();
        await delay(200);
        await seedAutoridad();
        await delay(200);
        await seedEvento();
        await delay(200);
        // await seedBitacora();
        await delay(200);
        console.log("");

        // Nivel 3: Dependen de Usuario + Evento
        await seedPonenteEvento();
        await delay(200);
        await seedSuscripcionEvento();
        await delay(200);
        console.log("");

        // Nivel 4: Dependen de Usuario
        await seedSuscripcion();
        await delay(200);
        await seedSuscripcionDetails();
        await delay(200);
        console.log("");

        console.log("✅ Siembra completada exitosamente!");
        return "recien plantada";
    } catch (error) {
        console.error("Error al sembrar la base de datos:", error);
        return "error al plantar";
    }
};

export default seed;