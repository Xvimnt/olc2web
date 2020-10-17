import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Return } from './Return';
import { Break } from './Break';
import { Continue } from './Continue';
import { Error_ } from '../Error';
import { errores } from '../Errores';

export class Switch extends Instruction {
    public translate(environment: Environment): String {
        throw new Error('Method not implemented.');
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

    constructor(private condition: Expression, private casos: any, private def: any,
        line: number, column: number) {
        super(line, column);
    }

    public execute(env: Environment) {
        if (this.casos != null) {
            const mainElement = this.condition.execute(env);
            for (let caso of this.casos) {
                const secondElement = caso['condicion'].execute(env);
                if (mainElement.type != secondElement.type) errores.push(new Error_(this.line, this.column, 'Semantico', 'El case tiene que ser de el mismo tipo que el switch'));
                if (mainElement.value == secondElement.value) {
                    for (let instr of caso['instruccion']) {
                        if (instr instanceof Return) return instr.execute(env);
                        else if (instr instanceof Break) return;
                        else if (instr instanceof Continue) break;
                        else instr.execute(env);
                    }
                }
            }
            if (this.def != null) return this.def.execute(env);
        }
    }
}
