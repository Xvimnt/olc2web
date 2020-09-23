import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { Literal } from "../Expression/Literal";
import { _Type } from "../Types/Type";
import { isNumber, isString, isBoolean, isArray } from "util";
import { Error_ } from "../Error";
import { errores } from '../Errores';
import { _Array } from '../Object/Array';
import { ArrayType } from '../Types/Array';

export class Declaration extends Instruction {

    public plot(count: number): string {

        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Declaracion " + this.id + "\";";

        // Hijo 1
        result += "node" + count + "1[label=\"(" + this.method.line + "," + this.method.column + ") Metodo\"];";
        result += this.method.plot(Number(count + "1"));
        result += "node" + count + " -> " + "node" + count + "1;";
        // Hijo 2
        if (this.type != null) {
            result += "node" + count + "2[label=\"(" + this.type.line + "," + this.type.column + ") Tipo\"];";
            result += this.type.plot(Number(count + "2"));
            result += "node" + count + " -> " + "node" + count + "2;";
        }
        // Hijo 3
        if (this.value != null) {
            result += "node" + count + "3[label=\"(" + this.value.line + "," + this.value.column + ") Valor\"];";
            result += this.value.plot(Number(count + "3"));
            result += "node" + count + " -> " + "node" + count + "3;";
        }
        return result;
    }

    constructor(private method: Literal, private type: _Type | ArrayType, private id: string, private value: Expression, line: number, column: number) {
        super(line, column);
    }

    private validacionRecursiva(): boolean {

        return true;
    }

    public execute(environment: Environment) {
        if (this.type instanceof ArrayType) {
            // Ver el metodo
            if (this.value != null) {
                //TODO Validar que las dimensiones sean exactas y validar que cada elemento sea de su tipo
                let valores = [];
                for (let i in this.value) {
                    valores[i.toString()] = this.value[i].execute(environment);
                }
                if (this.type instanceof ArrayType) {
                    let arrObject = new _Array(this.type.dimensions, valores, this.type.type);
                    if (this.validacionRecursiva()) environment.guardar(this.id, arrObject, 4);
                }
            } else {
                if (this.method.execute(environment).value == 'const') errores.push(new Error_(this.line, this.column, 'Semantico', 'Constante no puede ser vacia'));
                let arrObject = new _Array(this.type.dimensions, new Array(), this.type.type);
                environment.guardar(this.id, arrObject, 4);
            }
        }
        else {
            // Si es un struct
            if (isArray(this.value)) {
                // Se declara el struct
                if (this.type.toString() == 'type') {
                    environment.guardar(this.id, this.value, 7);
                }
                // Se declara una variable tipo struct
                else {
                    // Obtener el struct para validarlo
                    const struct = environment.getVar(this.type.execute().value);
                    // if (isArray(this.value)) {
                    //     if (this.value.length == struct.valor.length) {
                    //         // Verificar que cada valor de la asignacion pertenezca al struct
                    //         this.value.forEach(element => {
                    //             let pointer = struct.valor.length;
                    //             struct.valor.forEach(key => {
                    //                 if (element.id == key.id) {
                    //                     if (element.value != null && element.value.execute().type != key.type.execute().type) errores.push(new Error_(element.value.line, element.value.column, 'Semantico', 'Atributo de tipo no valido en la declaracion del type: ' + element.value.execute().value));
                    //                     return; // se sale del foreach
                    //                 }
                    //                 pointer--;
                    //             });
                    //             if (pointer == 0) errores.push(new Error_(this.line, this.column, 'Semantico', 'Atributo no valido en la declaracion del type: ' + element.id));
                    //         });
                    //     } else errores.push(new Error_(this.line, this.column, 'Semantico', 'Numero de atributos no validos en el type'));
                    //     environment.guardar(this.id, this.value, 7);
                    // }
                }
            }
            // Se declara una variable normal
            if (this.value != null) {
                const val = this.value.execute(environment);

                if (this.type == null) environment.guardar(this.id, val.value, val.type);
                else {
                    switch (this.type.execute().value) {
                        case 'number':
                            if (!isNumber(val.value)) errores.push(new Error_(this.line, this.column, 'Semantico', 'Numero no valido'));
                            break;
                        case 'string':
                            if (!isString(val.value)) errores.push(new Error_(this.line, this.column, 'Semantico', 'String no valida'));
                            break;
                        case 'boolean':
                            if (!isBoolean(val.value)) errores.push(new Error_(this.line, this.column, 'Semantico', 'Booleano no valido'));
                            break;
                        default:
                            console.log('no se guarda nada');
                            break;
                    }
                    environment.guardar(this.id, val.value, val.type);
                }
            }
            else {
                if (this.method.execute(environment).value == 'const') errores.push(new Error_(this.line, this.column, 'Semantico', 'Constante no puede ser vacia'));
                environment.guardar(this.id, 'undefined', 3);
            }
        }
    }

}