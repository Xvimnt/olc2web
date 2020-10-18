import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";
import { _Type } from '../Types/Type';
import { Param } from '../Expression/Param';
import { _Console } from '../Util/Salida';

export class Function extends Instruction {
    public translate(environment: Environment): String {
        // Arreglar Stack
        let newP = 0;
        this.parametros.forEach(element => {
            _Console.pila[environment.getP() + newP] = element.id;
            newP++;
        });
        let tempP = environment.getP();
        environment.setP(environment.getP() + newP);

        let result = "void " + this.id + "() {\n";
        result += this.statment.translate(environment);
        environment.setP(tempP);
        return result + "}\n";

    }

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

    constructor(private id: string, public statment: Instruction, public parametros: Array<Param>, public type: _Type, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment) {
        environment.guardarFuncion(this.id, this);
    }
}

