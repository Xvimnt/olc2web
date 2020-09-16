import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Literal } from '../Expression/Literal';

export class Function extends Instruction {

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Funcion:" + this.id + "\"];";
        // Hijo 1
        result += "node" + count + "1[label=\"(" + this.statment.line + "," + this.statment.column + ") Elemento\"];";
        result += this.statment.plot(Number(count + "1"));
        // Flechas
        result += "node" + count + " -> " + "node" + count + "1;";
        return result;
    }

    htmlRow() {
        let result = "";
        result += "<td>Instrucciones</td>" + "<td>" + this.id + "</td>" + "<td>Funcion</td>";
        return result;
    }

    constructor(private id: string, public statment: Instruction, public parametros: Array<string>,public type: Literal, line: number, column: number) {
        super(line, column);
        this.id = id;
        this.statment = statment;
        this.parametros = parametros;
        this.type = type;
    }

    public execute(environment: Environment) {
        environment.guardarFuncion(this.id, this);
    }
}

