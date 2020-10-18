import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Return } from './Return';
import { Break } from './Break';
import { Continue } from './Continue';
import { Error_ } from '../Error';
import { errores } from '../Errores';
import { _Console } from '../Util/Salida';
import { Case } from './Case';

export class Switch extends Instruction {
    public translate(environment: Environment): String {
        let result = this.condition.translate(environment);
        environment.setLastT(_Console.count - 1);
        environment.setLastL(_Console.labels + this.casos.length * 2);
        this.casos.forEach(element => {
            result += "" + element.translate(environment);
        });

        if (this.def != null) {
            result += "" + this.def.translate(environment);
        }
        result += "l" + _Console.labels + ":\n";
        _Console.labels++;
        return result;
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Switch\"];";
        // Hijo 1
        result += "node" + count + "1[label=\"(" + this.condition.line + "," + this.condition.column + ") Condicion\"];";
        result += this.condition.plot(Number(count + "1"));
        // Flechas
        result += "node" + count + " -> " + "node" + count + "1;";

        return result;
    }

    constructor(private condition: Expression, private casos: Case[], private def: Case,
        line: number, column: number) {
        super(line, column);
    }

    public execute(env: Environment) {

    }
}
