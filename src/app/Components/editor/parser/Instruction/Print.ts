import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { _Console } from "../Util/Salida";
import { faOtter } from '@fortawesome/free-solid-svg-icons';
import { _Struct } from '../Object/Struct';

export class Print extends Instruction {
    public translate(environment: Environment): String {
        let result = "";
        this.value.forEach(element => {
            result += element.translate(environment);
        });
        result += 'printf("%c", t' + (_Console.count - 1) + ');\n';
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