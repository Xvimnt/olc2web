import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Retorno } from "../Abstract/Retorno";
import { Error_ } from "../Error";
import { errores } from '../Errores';
import { Symbol } from "../Symbol/Symbol";
import { Access } from './Access';
import { _Array } from '../Object/Array';
import { isArray } from 'util';
import { _Struct } from '../Object/Struct';


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
            // Obtener el objeto
            let val: Symbol = new Symbol(null, null, null);
            // Si es un Array
            if (isArray(this.id.getID())) {
                val.valor = this.id.execute(environment);
            }
            // si es un struct
            else val = environment.getVar(this.id.getID());
            // Viendo que tipo es
            if (val.valor instanceof _Struct) {
                if (val.valor.hasAtribute(this.property)) {
                    return val.valor.getAtribute(this.property);
                } else errores.push(new Error_(this.line, this.column, 'Semantico', 'Atributo no existente en el type'));
            }
            else if (val.valor instanceof _Array) {
                // Obtener la propiedad
                if (this.property == 'length') return { value: val.valor.length(), type: 0 }
            }
        }
        // Si es un struct
        else if (this.id instanceof Property) {
            // Acceder al elemento para ver el valor
            const element = this.id.execute(environment).value;
            if (element instanceof _Struct) {
                return element.getAtribute(this.property);
            }
            else {
                for (let index in element) {
                    if (element[index].id == this.property) {
                        // Acceder al struct para ver el tipo
                        return { value: element[index].value, type: 3 }
                    }
                }
            }
            return { value: null, type: 3 }
        }
        return { value: null, type: 3 }
    }
}