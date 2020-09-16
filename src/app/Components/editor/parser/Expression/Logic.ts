import { Expression } from "../Abstract/Expression";
import { Retorno, Type } from "../Abstract/Retorno";
import { Environment } from "../Symbol/Environment";
import { Error_ } from "../Error";

export enum LogicOption {
    AND,
    OR,
    NOT
}

export class Logic extends Expression {
    private getTypeName() {
        switch (this.type) {
            case LogicOption.AND:
                return "And &&";
            case LogicOption.OR:
                return "Or ||";
            case LogicOption.NOT:
                return "Not !";
            default:
                return "Error";
        }
    }
    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Logica: " + this.getTypeName() + "\"];";
        result += "node" + count + "1[label=\"(" + this.left.line + "," + this.left.column + ") Izquierdo\"];";
        result += this.left.plot(Number(count + "1"));
        result += "node" + count + "2[label=\"(" + this.right.line + "," + this.right.column + ") Derecho\"];";
        result += this.right.plot(Number(count + "2"));
        // Flechas
        result += "node" + count + " -> " + "node" + count + "1;";
        result += "node" + count + " -> " + "node" + count + "2;";
        return result;
    }

    constructor(private left: Expression, private right: Expression, private type: LogicOption, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment): Retorno {
        const leftValue = this.left.execute(environment);
        const rightValue = this.right.execute(environment);
        if (leftValue == null || rightValue == null) throw new Error_(this.line, this.column, 'Semantico', 'Operador no definido');
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