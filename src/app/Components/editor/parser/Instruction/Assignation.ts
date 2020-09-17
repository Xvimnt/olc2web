import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { isArray } from 'util';

export class Assignation extends Instruction {

    private id: string;
    private value: Expression;

    public plot(count: number): string {

        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Assignacion " + this.id + "\";";

        // Hijo 1
        result += "node" + count + "1[label=\"(" + this.value.line + "," + this.value.column + ") Valor\"];";
        result += this.value.plot(Number(count + "1"));
        // Flechas
        result += "node" + count + " -> " + "node" + count + "1;";

        return result;
    }

    constructor(id: string, value: Expression, line: number, column: number) {
        super(line, column);
        this.id = id;
        this.value = value;
    }

    public execute(environment: Environment) {
        if (isArray(this.value)) {
            //Asignarle valor a todos los nodos
            console.log('asignando a ' + this.id + ' ' + this.value);
            //environment.guardar(this.id, this.value, 7);
        }
        else if (isArray(this.id)) {
            //Asignarle valor a una propiedad
            console.log('id y propiedad:', this.id);
        }
        else if (this.value != null) {
            const val = this.value.execute(environment);
            // TODO Comprobar tipos en la asignacion
            environment.guardar(this.id, val.value, val.type);
        }
    }

}