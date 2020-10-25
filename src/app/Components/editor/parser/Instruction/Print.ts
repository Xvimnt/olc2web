import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { _Console } from "../Util/Salida";
import { faOtter } from '@fortawesome/free-solid-svg-icons';
import { _Struct } from '../Object/Struct';

export class Print extends Instruction {
    public translate(environment: Environment): String {
        let result = "// Console.log\n";
        this.value.forEach(element => {
            result += element.translate(environment);
            switch (_Console.printOption) {
                case 0:
                    result += 'printf("%c", t' + (_Console.count - 1) + ');\n';
                    break;
                case 1:
                    let pointer = _Console.count;
                    result += "t" + pointer + " = t" + (_Console.count - 1) + ";\n";
                    _Console.count++;
                    result += "t" + _Console.count + " = Heap[t" + (_Console.count - 1) + "];\n";
                    _Console.count++;
                    let sizePointer = _Console.count;
                    result += "t" + sizePointer + " = t" + (_Console.count - 1) + " + t" + pointer + ";\n";
                    _Console.count++;
                    result += "l" + _Console.labels + ":\n";
                    _Console.labels++;
                    result += "t" + pointer + " = t" + pointer + " + 1;\n";
                    result += "t" + _Console.count + " = Heap[t" + pointer + "];\n";
                    _Console.count++;
                    result += 'printf("%c", t' + (_Console.count - 1) + ');\n';
                    result += "t" + _Console.count + " = t" + pointer + " <= t" + sizePointer + ";\n";
                    result += "if(t" + (_Console.count - 1) + ") goto l" + (_Console.labels - 1) + ";\n";
                    break;
            }
        });
        return result;
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Print\"];";
        let index = 1;
        this.value.forEach(element => {
            const newLabel = count + "" + index;
            result += element.plot(Number(newLabel));
            result += "node" + count + " -> " + "node" + newLabel + ";";
            index++;
        });
        return result;
    }

    constructor(private value: Array<Expression>, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment) {
        this.value.forEach(element => {
            if (element.execute(environment) != undefined) {
                let resultado = element.execute(environment).value;
                if (resultado instanceof _Struct) _Console.salida = resultado.print();
                else _Console.salida += resultado + " ";
            } else _Console.salida += "";
        });
        _Console.salida += "\n";
    }
}