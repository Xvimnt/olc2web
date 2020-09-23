import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Retorno } from "../Abstract/Retorno";
import { Error_ } from "../Error";
import { errores } from '../Errores';
import { Symbol } from "../Symbol/Symbol";
import { Access } from './Access';


export class Property extends Expression {

    constructor(public id: any, private property: string, line: number, column: number) {
        super(line, column);
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") " + this.id + ": Acceso\";";
        return result;
    }

    public getObject(): string { if (this.id instanceof Access) return this.id.getID(); }
    public getProperty(): string { return this.property; }

    public execute(environment: Environment): Retorno {
        if (this.id instanceof Access) {
            const val = this.id.execute(environment);
            for (let index in val.value) {
                if (val.value[index].id == this.property) {
                    if (val.value[index].value != null) {
                        // Si la propiedad es un struct
                        if (val.value[index].value instanceof Array) {
                            return { value: val.value[index].value, type: 7 }
                        }
                        // La propiedad es un nativo
                        else {
                            return { value: val.value[index].value, type: 0 }
                        }
                    }
                }
            }
        }
        else if (this.id instanceof Property) {
            // Acceder al elemento para ver el valor
            const element = this.id.execute(environment);
            for (let index in element.value) {
                if (element.value[index].id == this.property) {
                    // Acceder al struct para ver el tipo
                    return { value: element.value[index].value, type: 3 }
                }
            }
            return { value: null, type: 3 }
        }
        return { value: null, type: 3 }
    }
}