import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Type } from "../Abstract/Retorno";
import { errores } from '../Errores';
import { Error_ } from '../Error';

export class While extends Instruction {

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Switch\"];";
        // Hijo 1
        result += "node" + count + "1[label=\"(" + this.condition.line + "," + this.condition.column + ") Condicion\"];";
        result += this.condition.plot(Number(count + "1"));
        // Hijo 2
        result += "node" + count + "2[label=\"(" + this.code.line + "," + this.code.column + ") Condicion\"];";
        result += this.code.plot(Number(count + "2"));
        // Flechas
        result += "node" + count + " -> " + "node" + count + "1;";
        result += "node" + count + " -> " + "node" + count + "2;";
        return result;
    }

    constructor(private condition: Expression, private code: Instruction, line: number, column: number) {
        super(line, column);
    }

    public execute(env: Environment) {
        let condition = this.condition.execute(env);
        if (condition.type != Type.BOOLEAN) {
            throw { error: "La condicion no es booleana", linea: this.line, columna: this.column };
        }
        while (condition.value == true) {
            const element = this.code.execute(env);
            if (element != null || element != undefined) {
                if (element.type == 'Break')
                    break;
                else if (element.type == 'Continue')
                    continue;
                else if (element.type == 'Return')
                    return;
            }
            condition = this.condition.execute(env);
            if (condition.type != Type.BOOLEAN) {
                errores.push(new Error_(this.line, this.column, 'Semantico', 'La condicion no es booleana'));
            }
        }
    }
}