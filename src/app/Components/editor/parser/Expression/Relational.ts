import { Expression } from "../Abstract/Expression";
import { Retorno, Type } from "../Abstract/Retorno";
import { Environment } from "../Symbol/Environment";

export enum RelationalOption {
    EQUAL,
    NOTEQUAL,
    LESS,
    LESSOREQUAL,
    GREATER,
    GREATEROREQUAL
}

export class Relational extends Expression {

    constructor(private left: Expression, private right: Expression, private type: RelationalOption, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment): Retorno {
        const leftValue = this.left.execute(environment);
        const rightValue = this.right.execute(environment);
        switch (this.type) {
            case RelationalOption.EQUAL:
                return { value: (leftValue.value == rightValue.value), type: Type.BOOLEAN };
            case RelationalOption.NOTEQUAL:
                return { value: (leftValue.value != rightValue.value), type: Type.BOOLEAN };
            case RelationalOption.GREATER:
                return { value: (leftValue.value > rightValue.value), type: Type.BOOLEAN };
            case RelationalOption.GREATEROREQUAL:
                return { value: (leftValue.value >= rightValue.value), type: Type.BOOLEAN };
            case RelationalOption.LESS:
                return { value: (leftValue.value < rightValue.value), type: Type.BOOLEAN };
            case RelationalOption.LESSOREQUAL:
                return { value: (leftValue.value <= rightValue.value), type: Type.BOOLEAN };
            default:
                return { value: 0, type: Type.NUMBER }
        }
    }
}