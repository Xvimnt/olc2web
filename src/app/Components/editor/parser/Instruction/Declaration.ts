import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { Literal } from "../Expression/Literal";
import { _Type } from "../Expression/Type";
import { isNumber, isString, isBoolean, isArray } from "util";
import { Error_ } from "../Error";
import { errores } from '../Errores';

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

    constructor(private method: Literal, private type: _Type, private id: string, private value: Expression, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment) {
        // Si es un struct
        if (isArray(this.value)) environment.guardar(this.id, this.value, 7);
        // Se declara una variable normal
        else if (this.value != null) {
            const val = this.value.execute(environment);

            if (this.type == null) environment.guardar(this.id, val.value, val.type)
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