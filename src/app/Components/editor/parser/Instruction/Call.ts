import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";
import { Symbol } from "../Symbol/Symbol";
import { Expression } from "../Abstract/Expression";
import { Error_ } from "../Error";
import { errores } from '../Errores';
import { Access } from '../Expression/Access';
import { Property } from '../Expression/Property';
import { _Array } from '../Object/Array';
import { _Type } from '../Types/Type';
import { error } from 'protractor';
import { ArrayType } from '../Types/Array';
import { isArray } from 'util';

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

    constructor(private id: Access | Property, private expresiones: Array<any>, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment) {
        if (this.id instanceof Access) {
            const func = environment.getFuncion(this.id.getID());
            if (func != undefined) {
                const newEnv = new Environment(environment.getGlobal());
                for (let i = 0; i < this.expresiones.length; i++) {
                    const param = func.parametros[i];
                    if (param.type instanceof _Type) {
                        const value = this.expresiones[i].execute(environment);
                        if (param.execute().type == value.type)
                            newEnv.guardar(param.execute().value, value.value, value.type);
                        else errores.push(new Error_(this.line, this.column, 'Semantico', 'Parametro de tipo invalido'));
                    } else {
                        // Obtener array
                        if (this.expresiones[i] instanceof Access) {
                            const arr = environment.getVar(this.expresiones[i].getID());
                            // Comprobar Dimensiones
                            let tipo: ArrayType = param.type;
                            if (tipo.dimensions != arr.valor.dimensions) errores.push(new Error_(this.line, this.column, 'Semantico', 'Parametro con dimensiones no validas'));
                            // Comprobar Tipo
                            if (tipo.type.execute().type != arr.valor.tipo.execute().type) errores.push(new Error_(this.line, this.column, 'Semantico', 'Parametro de tipo invalido'));
                            // No hubo error 
                            newEnv.guardar(param.execute().value, arr.valor, 4);
                        }
                    }
                }
                const result = func.statment.execute(newEnv);
                console.log('se obtiene ',result);
                console.log('en funcion',func);
                // Para el void
                if(func.type == null || func.type.execute().type == 3) return result;
                // Para Otras funciones
                if (result != null) {
                    if (result.type == func.type.execute().type) return result;
                    else errores.push(new Error_(this.line, this.column, 'Semantico', 'Return y funcion de tipos distintos '));
                }
                else errores.push(new Error_(this.line, this.column, 'Semantico', 'Return y funcion de tipos distintos'));

            } else errores.push(new Error_(this.line, this.column, 'Semantico', 'Funcion no definida'));
        }
        else if (this.id instanceof Property) {
            // Obtener el objeto
            // console.log('propiedad', this);)
            let obj: Symbol = new Symbol(null, null, null);
            if (isArray(this.id.id.id)) {
                obj.valor = this.id.id.execute(environment);
            }
            else {
                obj = environment.getVar(this.id.id.getID());
            }
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
