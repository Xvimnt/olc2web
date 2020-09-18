import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { isArray } from 'util';
import { Access } from '../Expression/Access';

export class Assignation extends Instruction {

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Assignacion " + this.id + "\";";

        // Hijo 1
        result += "node" + count + "1[label=\"(" + this.value.line + "," + this.value.column + ") Valor\"];";
        result += this.value.plot(Number(count + "1"));
        // Flechas
        result += "node" + count + " -> " + "node" + count + "1;";

        return result;
    }

    constructor(private id: any, private value: Expression, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment) {
        if (isArray(this.value)) {
            if(this.id instanceof Access) {
                environment.guardar(this.id.getID(),this.value,7);
            }
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