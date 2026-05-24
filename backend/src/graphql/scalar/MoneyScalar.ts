import { GraphQLScalarType, GraphQLError, Kind } from "graphql";
import { decimalToInt, intToDecimal } from "@/func/money";

const MoneyScalar = new GraphQLScalarType({
    name: "Money",
    description: "Dinero almacenado como entero (centavos) internamente, expuesto como decimal al cliente.",

    // BD → Cliente: convierte centavos (BigInt) a string formateado "8.800,20"
    serialize(value: unknown): string {
        if (typeof value !== "number" && typeof value !== "bigint" && typeof value !== "string") {
            throw new GraphQLError(`Money serialize: valor inválido "${value}"`);
        }
        return intToDecimal(value as number | bigint | string);
    },

    // Cliente → BD (variables): convierte string/number a centavos enteros
    parseValue(value: unknown): number {
        if (typeof value !== "number" && typeof value !== "string") {
            throw new GraphQLError(`Money parseValue: se esperaba number o string, recibió "${typeof value}"`);
        }
        return decimalToInt(value);
    },

    // Cliente → BD (literales en query): ej. createProduct(price: 1.50)
    parseLiteral(ast): number {
        if (ast.kind !== Kind.FLOAT && ast.kind !== Kind.INT && ast.kind !== Kind.STRING) {
            throw new GraphQLError(`Money parseLiteral: tipo de literal inválido "${ast.kind}"`);
        }
        return decimalToInt(ast.value);
    },
});

export default MoneyScalar;