import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { Error_ } from "../Error";
import { errores } from '../Errores';
import { Access } from '../Expression/Access';
import { Property } from '../Expression/Property';
import { _Array } from '../Object/Array';

export class Call extends Instruction {
    public plot(count: number): string {

        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Llamada\"];";

        // Hijo 1
        result += "node" + count + "1[label=\"(" + this.line + "," + this.column + ") ID: " + this.id + "\"];";
        // Hijo 2
        result += "node" + count + "2[label=\"(" + this.line + "," + this.column + ") Statement\"];";
        // Flechas
        result += "node" + count + " -> " + "node" + count + "1;";
        result += "node" + count + " -> " + "node" + count + "2;";

        return result;
    }

    constructor(private id: Access | Property, private expresiones: Array<Expression>, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment) {
        if (this.id instanceof Access) {
            const func = environment.getFuncion(this.id.getID());
            if (func != undefined) {
                const newEnv = new Environment(environment.getGlobal());
                for (let i = 0; i < this.expresiones.length; i++) {
                    const value = this.expresiones[i].execute(environment);
                    newEnv.guardar(func.parametros[i], value.value, value.type);
                }
                const result = func.statment.execute(newEnv);
                // si no es Void
                if (func.type != null) {
                    if (result != null) {
                        // Si es un struct
                        if (func.type.execute().type == 5) {
                            // debe retornar un array
                            if (result.type == 7) return result;
                        }
                        // el tipo es nativo
                        if (result.type == func.type.execute().type) return result;
                        else return { type: 3, value: 'undefined' }
                    }
                }

            } else errores.push(new Error_(this.line, this.column, 'Semantico', 'Funcion no definida'));
        }
        else if (this.id instanceof Property) {
            // Obtener el objeto
            // console.log('propiedad', this);
            const obj = environment.getVar(this.id.id.getID());
            // funciones nativas
            switch (this.id.getProperty()) {
                case 'push':
                    if (obj.valor instanceof _Array) {
                        if (this.expresiones.length == 1) {
                            obj.valor.push(this.expresiones[0].execute(environment));
                        } else errores.push(new Error_(this.line, this.column, 'Semantico', 'Numero de parametros incorrecto'));
                    } else errores.push(new Error_(this.line, this.column, 'Semantico', 'Propiedad no definida para el objeto'));
                    break;
                case 'pop':
                    if (obj.valor instanceof _Array) {
                        if (this.expresiones.length == 0) {
                            const retorno = obj.valor.pop();
                            return { value: retorno.value, type: retorno.type }
                        } else errores.push(new Error_(this.line, this.column, 'Semantico', 'Numero de parametros incorrecto'));
                    } else errores.push(new Error_(this.line, this.column, 'Semantico', 'Propiedad no definida para el objeto'));
                    break;
                case 'length':
                    if (obj.valor instanceof _Array) {
                        if (this.expresiones.length == 0) {
                            const retorno = obj.valor.length();
                            return { value: retorno, type: 0 }
                        } else errores.push(new Error_(this.line, this.column, 'Semantico', 'Numero de parametros incorrecto'));
                    } else errores.push(new Error_(this.line, this.column, 'Semantico', 'Propiedad no definida para el objeto'));
                    break;
            }
        }
    }
}
