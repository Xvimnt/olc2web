import { Expression } from "../Abstract/Expression";
import { Retorno, Type } from "../Abstract/Retorno";
import { Environment } from "../Symbol/Environment";
import { Error_ } from "../Error";

export enum UnaryOption {
    NEGATION,
    MINUS
}

export class Unary extends Expression {

    constructor(private value: Expression, private type: UnaryOption, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment): Retorno {
        const val = this.value.execute(environment);

        switch (this.type) {
            case UnaryOption.NEGATION:
                if (val.type == Type.BOOLEAN)
                    return { value: (!Boolean(val.value)), type: Type.BOOLEAN };
                else throw new Error_(this.line, this.column, "Semantico", "No se puede negar");
            default:
                if (val.type == Type.NUMBER)
                    return { value: (Number(val.value) * -1), type: Type.NUMBER };
                else throw new Error_(this.line, this.column, "Semantico", "No se puede negar");
        }
    }
}
