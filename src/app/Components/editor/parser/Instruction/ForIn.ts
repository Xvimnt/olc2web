import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { _Console } from '../Util/Salida';
import { Literal } from '../Expression/Literal';
import { errores } from '../Errores';
import { Error_ } from '../Error';
import { Symbol } from '../Symbol/Symbol';

export class ForIn extends Instruction {

    public translate(environment: Environment): String {
        let result = "// Inicia ForIn\n";
        let smb = _Console.symbols.get(this.array);
        if (smb != undefined) {
            result += "t" + _Console.count + " = p + " + smb.valor + ";\n";
            _Console.count++;
            let startT = _Console.count;
            result += "t" + startT + " = Stack[(int)t" + (_Console.count - 1) + "];\n";
            _Console.count++;
            let sizeT = _Console.count;
            result += "t" + sizeT + " = Heap[(int)t" + startT + "];\n";
            _Console.count++;
            let iteratorT = _Console.count;
            _Console.count++;
            let stackInd = _Console.stackPointer;
            _Console.stackPointer++;
            result += "t" + iteratorT + " = -1;\n";
            let iteratorStackIndex = _Console.count;
            _Console.count++;
            result += "t" + iteratorStackIndex + " = p + " + stackInd + ";\n";
            result += "Stack[(int)t" + iteratorStackIndex + "] = t" + iteratorT + ";\n";
            let ambito = (environment.getAnterior() == null) ? "Global" : "Local";
            _Console.symbols.set(this.id, new Symbol(stackInd, this.id, 0, ambito));
            environment.guardar(this.id, stackInd, 0);
            _Console.saveInStack(stackInd, 0);
            let alfa = _Console.labels;
            _Console.labels++;
            result += "l" + alfa + ":\n";
            // Condicion y asignacion de i
            result += "t" + iteratorT + " = t" + iteratorT + " + 1;\n";
            result += "t" + iteratorStackIndex + " = p + " + stackInd + ";\n";
            result += "Stack[(int)t" + iteratorStackIndex + "] = t" + iteratorT + ";\n";
            let inicio = _Console.labels;
            _Console.labels++;
            result += "t" + (_Console.count) + " = t" + iteratorT + " < t" + sizeT + ";\n";
            result += "if(t" + _Console.count + ") goto l" + inicio + ";\n";
            _Console.count++
            let final = _Console.labels;
            _Console.labels++;
            result += "goto l" + final + ";\n";
            result += "l" + inicio + ":\n";
            result += "" + this.code.translate(environment);
            result += "goto l" + alfa + ";\n";
            result += "l" + final + ":\n";
        } else errores.push(new Error_(this.line, this.column, 'Semantico', 'Variable no exitente'));
        return result;
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Foreach\"];";
        // Hijo 1
        result += "node" + count + "1[label=\"(" + this.method.line + "," + this.method.column + ") methodo\"];";
        result += this.method.plot(Number(count + "1"));
        // Hijo 2
        // Hijo 3
        result += "node" + count + "3[label=\"(" + this.code.line + "," + this.code.column + ") Codigo\"];";
        result += this.code.plot(Number(count + "3"));
        // Flechas
        result += "node" + count + " -> " + "node" + count + "1;";
        result += "node" + count + " -> " + "node" + count + "3;";

        return result;

    }

    constructor(private method: Literal, private id: string, private array: string,
        private code: Instruction, line: number, column: number) {
        super(line, column);
    }

    public execute(env: Environment) {

    }
}