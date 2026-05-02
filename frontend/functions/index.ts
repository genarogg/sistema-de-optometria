import { $ } from "./dom";
import { quitarAcentos, regexUrl, isValidEmail, isStrongPassword } from "./regexUtils";

import { client as clientApollo } from "@/providers/ApolloProvider";

export {
    $,
    quitarAcentos, regexUrl, isValidEmail, isStrongPassword,
    clientApollo
};