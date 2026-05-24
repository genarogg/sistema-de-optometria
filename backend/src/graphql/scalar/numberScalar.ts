import { GraphQLScalarType, Kind } from 'graphql'

const NumberScalar = new GraphQLScalarType({
    name: 'Number',
    description: 'Scalar que acepta Int o Float y se maneja como number en TypeScript',
    serialize(value) {
        if (typeof value !== 'number') {
            throw new TypeError(`Number cannot represent non-number value: ${value}`)
        }
        return value
    },
    parseValue(value) {
        if (typeof value !== 'number') {
            throw new TypeError(`Number cannot represent non-number value: ${value}`)
        }
        return value
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT || ast.kind === Kind.FLOAT) {
            return parseFloat(ast.value)
        }
        return null
    },
})

export default NumberScalar