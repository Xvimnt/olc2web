import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";

export class Call extends Instruction {
    public plot(count: number): string {

        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Llamada\";";

        // Hijo 1
        result += "node" + count + "1[label=\"(" + this.line + "," + this.column + ") ID\";";
        // Hijo 2
        result += "node" + count + "2[label=\"(" + this.line + "," + this.column + ") Statement\";";
        // Flechas
        result += "node" + count + " -> " + "node" + count + "1";
        result += "node" + count + " -> " + "node" + count + "2";

        return result;
    }

    constructor(private id: string, private expresiones: Array<Expression>, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment) {
        const func = environment.getFuncion(this.id);
        if (func != undefined) {
            const newEnv = new Environment(environment.getGlobal());
            for (let i = 0; i < this.expresiones.length; i++) {
                const value = this.expresiones[i].execute(environment);
                newEnv.guardar(func.parametros[i], value.value, value.type);
            }
            func.statment.execute(newEnv);
        }
    }
}
