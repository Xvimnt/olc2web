import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";
import { Error_ } from "../Error";
import { errores } from '../Errores';
import { _Console } from '../Util/Salida';

export enum OperationOption {
    INCREMENT,
    DECREMENT
}

export class Operation extends Instruction {

    public translate(environment: Environment): String {
        let result = "";
        let stckIndex = _Console.pila.lastIndexOf(this.id);
        if (stckIndex != -1) {
            result += "t" + _Console.count + " = p + " + (stckIndex - environment.getP()) + ";\n";
            _Console.count++;
            result += "t" + _Console.count + " = Stack[t" + (_Console.count - 1) + "];\n";
            _Console.count++;
            if (this.option == OperationOption.DECREMENT) {
                result += "t" + _Console.count + " = t" + (_Console.count - 1) + " - 1;\n";
                _Console.count++;
                result += "Stack[t" + (_Console.count - 3) + "] = t" + (_Console.count - 1) + ";\n";
            }
            else{
                result += "t" + _Console.count + " = t" + (_Console.count - 1) + " + 1;\n";
                _Console.count++;
                result += "Stack[t" + (_Console.count - 3) + "] = t" + (_Console.count - 1) + ";\n";
            }
        }
        return result;
    }

    private getName() {
        switch (this.option) {
            case OperationOption.INCREMENT: return "++";
            case OperationOption.DECREMENT: return "--";
        }
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Operacion:"
            + this.id + this.getName() + "\"];";
        return result;
    }

    constructor(private id: string, private option: OperationOption, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment) {
        const value = environment.getVar(this.id);
        if (value == null)
            errores.push(new Error_(this.line, this.column, 'Semantico', "La variable no existe"));
        if (this.option == OperationOption.INCREMENT) environment.guardar(this.id, value.valor + 1, value.type);
        else if (this.option == OperationOption.DECREMENT) environment.guardar(this.id, value.valor - 1, value.type);
    }
}
