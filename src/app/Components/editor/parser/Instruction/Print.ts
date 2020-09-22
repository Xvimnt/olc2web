import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { _Console } from "../Util/Salida";
import { faOtter } from '@fortawesome/free-solid-svg-icons';

export class Print extends Instruction {

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Print\"];";
        let index = 1;
        this.value.forEach(element => {
            const newLabel = count + "" + index;
            result += element.plot(Number(newLabel));
            result += "node" + count + " -> " + "node" + newLabel + ";";
            index ++;
        });
        return result;
    }

    constructor(private value: Array<Expression>, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment) {
        this.value.forEach(element => {
            if (element.execute(environment) != undefined) {
                const resultado = element.execute(environment).value;
                // si es un struct
                if (resultado instanceof Array) {
                    _Console.salida += "[\n";
                    resultado.forEach(element => {
                        _Console.salida += "  " + element.id + ": " + element.value + "\n";
                    });
                    _Console.salida += "]\n";
                }
                else _Console.salida += resultado + " ";
            } else _Console.salida += "";
        });
        _Console.salida += "\n";
    }
}