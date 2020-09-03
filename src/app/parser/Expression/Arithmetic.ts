import { Expression } from "../Abstract/Expression";
import { Retorno, Type } from "../Abstract/Retorno";
import { Environment } from "../Symbol/Environment";
import { env } from "process";
import { Error_ } from "../Error";

export enum ArithmeticOption {
    PLUS,
    MINUS,
    TIMES,
    DIV,
    POWER,
    MOD
}

export class Arithmetic extends Expression {

    constructor(private left: Expression, private right: Expression, private type: ArithmeticOption, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment): Retorno {
        const leftValue = this.left.execute(environment);
        const rightValue = this.right.execute(environment);

        switch (this.type) {
            case ArithmeticOption.PLUS:
                switch (this.tipoDominante(leftValue.type, rightValue.type)) {
                    case Type.STRING:
                        return { value: (leftValue.value.toString() + rightValue.value.toString()), type: Type.NUMBER };
                    case Type.NUMBER:
                        return { value: (leftValue.value + rightValue.value), type: Type.NUMBER };
                    default:
                        throw new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' _ ' + rightValue.type);
                }
            case ArithmeticOption.MINUS:
                switch (this.tipoDominante(leftValue.type, rightValue.type)) {
                    case Type.STRING:
                        throw new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' _ ' + rightValue.type);
                    case Type.NUMBER:
                        return { value: (leftValue.value - rightValue.value), type: Type.NUMBER };
                    default:
                        throw new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' _ ' + rightValue.type);
                }
            case ArithmeticOption.TIMES:
                switch (this.tipoDominante(leftValue.type, rightValue.type)) {
                    case Type.NUMBER:
                        return { value: (leftValue.value * rightValue.value), type: Type.NUMBER };
                    default:
                        throw new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' _ ' + rightValue.type);
                }
            case ArithmeticOption.POWER:
                switch (this.tipoDominante(leftValue.type, rightValue.type)) {
                    case Type.NUMBER:
                        return { value: (Math.pow(leftValue.value, rightValue.value)), type: Type.NUMBER };
                    default:
                        throw new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' _ ' + rightValue.type);
                }
                case ArithmeticOption.MOD:
                switch (this.tipoDominante(leftValue.type, rightValue.type)) {
                    case Type.NUMBER:
                        return { value: (leftValue.value % rightValue.value), type: Type.NUMBER };
                    default:
                        throw new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' _ ' + rightValue.type);
                }
            default:
                switch (this.tipoDominante(leftValue.type, rightValue.type)) {
                    case Type.NUMBER:
                        if (rightValue.value == 0)
                            throw new Error_(this.line, this.column, "Semantico", "No se puede dividir entre 0");
                        return { value: (leftValue.value / rightValue.value), type: Type.NUMBER };
                    default:
                        throw new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' _ ' + rightValue.type);
                }
        }
    }
}

/*
    3 + 5 * "hola mundo";
    Error
*/