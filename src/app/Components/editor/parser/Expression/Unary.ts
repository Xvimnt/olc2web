import { Expression } from "../Abstract/Expression";
import { Retorno, Type } from "../Abstract/Retorno";
import { Environment } from "../Symbol/Environment";
import { Error_ } from "../Error";
import { errores } from '../Errores';

export enum UnaryOption {
    NEGATION,
    MINUS
}

export class Unary extends Expression {

    constructor(private value: Expression, private type: UnaryOption, line: number, column: number) {
        super(line, column);
    }

    private getTypeName() {
        switch (this.type) {
            case UnaryOption.NEGATION:
                return "Not !";
            case UnaryOption.MINUS:
                return "Negacion -";
            default:
                return "Error";
        }
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Logica: " + this.getTypeName() + "\"];";
        result += "node" + count + "1[label=\"(" + this.value.line + "," + this.value.column + ") Izquierdo\"];";
        result += this.value.plot(Number(count + "11"));
        result += "node" + count + "1 -> " + "node" + count + "11;";
        // Flechas
        result += "node" + count + " -> " + "node" + count + "1;";
        return result;
    }

    public execute(environment: Environment): Retorno {
        const val = this.value.execute(environment);

        switch (this.type) {
            case UnaryOption.NEGATION:
                if (val.type == Type.BOOLEAN)
                    return { value: (!Boolean(val.value)), type: Type.BOOLEAN };
                else errores.push(new Error_(this.line, this.column, "Semantico", "No se puede negar"));
            default:
                if (val.type == Type.NUMBER)
                    return { value: (Number(val.value) * -1), type: Type.NUMBER };
                else errores.push(new Error_(this.line, this.column, "Semantico", "No se puede negar"));
        }
    }
}
