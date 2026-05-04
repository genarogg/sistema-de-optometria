const DEBUG = false

const BACKEND_DEV = "http://localhost:4000"
const BACKEND_PROD = "http://localhost:4000"

const FRONTEND_DEV = "http://localhost:3000"
const FRONTEND_PROD = process.env.NEXT_PUBLIC_FRONTEND

/* GOOGLE */
const RECAPTCHA_KEY = "6LftVtMrAAAAAJLjNlwnzuak4g3g1vNY8eRtj5AC"

// saber si estoy en produccion
const NODE_ENV = process.env.NODE_ENV;
const isProd = NODE_ENV === "production";

const URL_BACKEND = isProd ? BACKEND_PROD : BACKEND_DEV;
const URL_FRONTEND = isProd ? FRONTEND_PROD : FRONTEND_DEV;

export {
    isProd,
    DEBUG,
    URL_BACKEND,
    URL_FRONTEND,
    RECAPTCHA_KEY
};