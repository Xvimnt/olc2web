import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Retorno } from "../Abstract/Retorno";
import { Error_ } from "../Error";
import { errores } from '../Errores';
import { isArray, isNumber } from 'util';
import { _Array } from '../Object/Array';
import { Call } from '../Instruction/Call';
import { _Struct } from '../Object/Struct';
import { _Console } from '../Util/Salida';

export class Access extends Expression {
    public translate(environment: Environment): String {
        let result = "";
        if (environment.getAnterior() != null) {
            if (_Console.pila.includes(this.id)) {
                result += "t" + _Console.count + " = p + " + (_Console.pila.lastIndexOf(this.id) - environment.getP()) + "\n";
                _Console.count++;
                result += "t" + _Console.count + " = " + "Stack[t" + (_Console.count - 1) + "]\n";
                _Console.count++;
            } else errores.push(new Error_(this.line, this.column, 'Semantico', 'Variable no exitente'));
        } else {
            if (_Console.heap.includes(this.id)) {
                result += "t" + _Console.count + " = h + " + (_Console.heap.indexOf(this.id)) + "\n";
                _Console.count++;
                result += "t" + _Console.count + " = Heap[t" + (_Console.count - 1) + "]\n";
                _Console.count++;
            } else errores.push(new Error_(this.line, this.column, 'Semantico', 'Variable no exitente'));
        }

        return result;
    }

    constructor(private id: any, line: number, column: number) {
        super(line, column);
    }

    public getID() { return this.id }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") " + this.id + ": Acceso\"];";
        return result;
    }

    public execute(environment: Environment): Retorno {
        if (isArray(this.id)) {
            // Si es un array
            const value = environment.getVar(this.id[0]);
            if (value.valor instanceof _Array) {
                let indexArray = this.id[1];
                if (value.valor.dimensions < indexArray.length) errores.push(new Error_(this.line, this.column, 'Semantico', 'Index invalido'));
                // Valores iniciales
                let count = 0;
                let index: Retorno = (indexArray[0].value == undefined) ? indexArray[0].execute(environment) : indexArray[0];
                let newValue: _Array = value.valor;
                while (count < indexArray.length - 1) {
                    // Obteniendo el index
                    index = (indexArray[count].value == undefined) ? indexArray[count].execute(environment) : indexArray[count];
                    // Obtiene el array
                    if (newValue == undefined) errores.push(new Error_(this.line, this.column, 'Semantico', 'Variable no definida'));
                    else newValue = newValue.getAtributo(index.value);
                    count++;
                }
                index = (indexArray[count].value == undefined) ? indexArray[count].execute(environment) : indexArray[count];
                if (isNumber(index.value)) index.value = index.value.toFixed();
                return (newValue.getAtributo(index.value) == null) ? { value: null, type: 3 } : newValue.getAtributo(index.value);
            }
        }
        else {
            const value = environment.getVar(this.id);
            if (value == null)
                errores.push(new Error_(this.line, this.column, 'Semantico', 'Variable no definida'));
            else if (value.valor instanceof _Array) {
                return { value: value.valor.print(), type: 4 }
            }
            else return { value: value.valor, type: value.type };
        }
    }
}