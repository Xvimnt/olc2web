import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { isArray } from 'util';
import { Access } from '../Expression/Access';
import { Property } from '../Expression/Property';
import { env } from 'process';
import { _Array } from '../Object/Array';

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
            if (this.id instanceof Access) {
                // Arreglar los Accesos
                for (let index in this.value) this.value[index].value = (this.value[index].value == null) ? null : this.value[index].value.execute(environment).value;
                environment.guardar(this.id.getID(), this.value, 7);
            }
        }
        else if (isArray(this.id.id)) {
            // Si es un array
            const value = environment.getVar(this.id.id[0]);
            if (value.valor instanceof _Array) {
                this.id.id[1].forEach(element => {
                    if (element instanceof Access) {
                        let newElement = element.execute(environment);
                        value.valor.setAtributo(newElement.value, this.value.execute(environment));
                    }
                    else value.valor.setAtributo(element.value, this.value.execute(environment));
                });
            }
        }
        else if (this.id instanceof Property) {
            // Obtener el struct para validarlo
            const struct = environment.getVar(this.id.getObject());
            //Asignarle valor a una propiedad del struct
            const result = this.value.execute(environment);

            // Buscar la propiedad que se asignara
            for (let index in struct.valor) {
                if (struct.valor[index].id == this.id.getProperty()) {
                    // Se sobrescribe el valor
                    struct.valor[index].value = (result.value == null) ? null : result.value;
                }
            }
        }
        else if (this.value != null) {
            const val = this.value.execute(environment);
            // TODO Comprobar tipos en la asignacion
            if (this.id instanceof Access) environment.guardar(this.id.getID(), val.value, val.type);
            else environment.guardar(this.id, val.value, val.type);
        }
    }
}