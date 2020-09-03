import { Expression } from "../Abstract/Expression";
import { Retorno, Type } from "../Abstract/Retorno";
import { Environment } from "../Symbol/Environment";

export enum LogicOption {
    AND,
    OR,
    NOT
}

export class Logic extends Expression {

    constructor(private left: Expression, private right: Expression, private type: LogicOption, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment): Retorno {
        const leftValue = this.left.execute(environment);
        const rightValue = this.right.execute(environment);
        switch (this.type) {
            case LogicOption.AND:
                return { value: (leftValue.value && rightValue.value), type: Type.BOOLEAN };
            case LogicOption.OR:
                return { value: (leftValue.value || rightValue.value), type: Type.BOOLEAN };
            default:
                return { value: 0, type: Type.NUMBER }
        }
    }
}