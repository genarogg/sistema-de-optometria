const DEBUG = false

const BACKEND_DEV = "http://localhost:4000"
const BACKEND_PROD = "https://optometria.nimbux.cloud"

const FRONTEND_DEV = "http://localhost:3000"
const FRONTEND_PROD = "https://optometria.nimbux.cloud"

/* GOOGLE */
const RECAPTCHA_KEY = "6LchANgsAAAAAARpGsiaoQccnqkuRJ2KHvP_aZIF"

// saber si estoy en produccion
const NODE_ENV = process.env.NODE_ENV;
const isProd = NODE_ENV === "production";



const URL_BACKEND = isProd ? BACKEND_PROD : BACKEND_DEV;
const URL_FRONTEND = isProd ? FRONTEND_PROD : FRONTEND_DEV;

console.log({
    isProd,
    DEBUG,
    URL_BACKEND,
    URL_FRONTEND,
    RECAPTCHA_KEY
})

export {
    isProd,
    DEBUG,
    URL_BACKEND,
    URL_FRONTEND,
    RECAPTCHA_KEY
};