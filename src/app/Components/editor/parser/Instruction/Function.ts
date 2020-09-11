import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";

export class Function extends Instruction {

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Funcion\";";

        // Hijo 1
        result += "node" + count + "1[label=\"(" + this.line + "," + this.column + ") ID\";";
        // Hijo 2
        result += "node" + count + "2[label=\"(" + this.line + "," + this.column + ") Statement\";";
        // Hijo 3
        result += "node" + count + "3[label=\"(" + this.line + "," + this.column + ") Parametros\";";
        // Flechas
        result += "node" + count + " -> " + "node" + count + "1";
        result += "node" + count + " -> " + "node" + count + "2";
        result += "node" + count + " -> " + "node" + count + "3";

        return result;
    }

    constructor(private id: string, public statment: Instruction, public parametros: Array<string>, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment) {
        environment.guardarFuncion(this.id, this);
    }
}