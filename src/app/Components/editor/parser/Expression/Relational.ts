import { Expression } from "../Abstract/Expression";
import { Retorno, Type } from "../Abstract/Retorno";
import { Error_ } from "../Error";
import { Environment } from "../Symbol/Environment";
import { errores } from '../Errores';

export enum RelationalOption {
    EQUAL,
    NOTEQUAL,
    LESS,
    LESSOREQUAL,
    GREATER,
    GREATEROREQUAL
}

export class Relational extends Expression {
    private getTypeName() {
        switch (this.type) {
            case RelationalOption.EQUAL:
                return "Igual =";
            case RelationalOption.NOTEQUAL:
                return "No igual !=";
            case RelationalOption.LESS:
                return "Menor <";
            case RelationalOption.LESSOREQUAL:
                return "Menor o Igual <=";
            case RelationalOption.GREATER:
                return "Mayor >";
            case RelationalOption.GREATEROREQUAL:
                return "Mayor o Igual >=";
            default:
                return "Error";
        }
    }
    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Relacional: " + this.getTypeName() + "\"];";
        result += "node" + count + "1[label=\"(" + this.left.line + "," + this.left.column + ") Izquierdo\"];";
        result += this.left.plot(Number(count + "1"));
        result += "node" + count + "2[label=\"(" + this.right.line + "," + this.right.column + ") Derecho\"];";
        result += this.right.plot(Number(count + "2"));
        // Flechas
        result += "node" + count + " -> " + "node" + count + "1;";
        result += "node" + count + " -> " + "node" + count + "2;";
        return result;
     }

    constructor(private left: Expression, private right: Expression, private type: RelationalOption, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment): Retorno {
        const leftValue = this.left.execute(environment);
        const rightValue = this.right.execute(environment);
        if (leftValue == null || rightValue == null) errores.push( new Error_(this.line, this.column, 'Semantico', 'Operador no definido'));

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