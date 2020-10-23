import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Type } from "../Abstract/Retorno";
import { _Console } from '../Util/Salida';
import { env } from 'process';

export class If extends Instruction {
    public translate(environment: Environment): String {
        let result = this.condition.translate(environment);
        result += "if(t" + (_Console.count - 1) + ") goto l" + _Console.labels + ";\n";
        _Console.labels++;
        let l2 = _Console.labels;
        result += "goto l" + _Console.labels + ";\n";
        result += "l" + (_Console.labels - 1) + ":\n"
        _Console.labels++;
        result += this.code.translate(environment) + "";
        result += "l" + l2 + ":\n";
        if (this.elsSt != null) result += this.elsSt.translate(environment) + "";
        return result;
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") If\"];";
        // Hijo 1
        result += "node" + count + "1[label=\"(" + this.condition.line + "," + this.condition.column + ") Condicion\"];";
        result += this.condition.plot(Number(count + "11"));
        result += "node" + count + "1 -> " + "node" + count + "11;";
        // Flecha
        result += "node" + count + " -> " + "node" + count + "1;";
        // Hijo 2
        result += "node" + count + "2[label=\"(" + this.code.line + "," + this.code.column + ") Codigo\"];";
        result += this.code.plot(Number(count + "21"));
        result += "node" + count + "2 -> " + "node" + count + "21;";
        // Flecha
        result += "node" + count + " -> " + "node" + count + "2;";

        // Hijo 3
        if (this.elsSt != null) {
            result += "node" + count + "3[label=\"(" + this.elsSt.line + "," + this.elsSt.column + ") ElseStatement\"];";
            result += this.elsSt.plot(Number(count + "31"));
            result += "node" + count + "3 -> " + "node" + count + "31;";
            // Flecha
            result += "node" + count + " -> " + "node" + count + "3;";
        }
        return result;
    }

    constructor(private condition: Expression, private code: Instruction, private elsSt: Instruction | null,
        line: number, column: number) {
        super(line, column);
    }

    public execute(env: Environment) {
        const condition = this.condition.execute(env);
        if (condition.type != Type.BOOLEAN) {
            throw { error: "La condicion no es booleana", linea: this.line, columna: this.column };
        }

        if (condition.value == true) {
            return this.code.execute(env);
        }
        else {
            return this.elsSt?.execute(env);
        }
    }
}
