import { Expression } from "../Abstract/Expression";
import { Retorno, Type } from "../Abstract/Retorno";
import { Environment } from "../Symbol/Environment";
import { Error_ } from "../Error";
import { errores } from '../Errores';
import { _Console } from '../Util/Salida';

export enum ArithmeticOption {
    PLUS,
    MINUS,
    TIMES,
    DIV,
    POWER,
    MOD
}

export class Arithmetic extends Expression {

    constructor(private left: Expression, private right: Expression, private type: ArithmeticOption, line: number, column: number) {
        super(line, column);
    }

    private getTypeName() {
        switch (this.type) {
            case ArithmeticOption.PLUS:
                return "Suma";
            case ArithmeticOption.MINUS:
                return "Resta";
            case ArithmeticOption.TIMES:
                return "Multiplicacion";
            case ArithmeticOption.POWER:
                return "Exponencia";
            case ArithmeticOption.MOD:
                return "Modulo";
            default:
                return "Error";
        }
    }
    
    private getTypeSign() {
        switch (this.type) {
            case ArithmeticOption.PLUS:
                return " + ";
            case ArithmeticOption.MINUS:
                return " - ";
            case ArithmeticOption.TIMES:
                return " * ";
            case ArithmeticOption.DIV:
                return " / ";
            case ArithmeticOption.POWER:
                return " ** ";
            case ArithmeticOption.MOD:
                return " % ";
            default:
                return "Error";
        }
    }
    public plot(count: number): string {

        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Aritmetica: " + this.getTypeName() + "\"];";
        result += "node" + count + "1[label=\"(" + this.left.line + "," + this.left.column + ") Izquierdo\"];";
        result += this.left.plot(Number(count + "11"));
        result += "node" + count + "1 -> " + "node" + count + "11;";

        result += "node" + count + "2[label=\"(" + this.right.line + "," + this.right.column + ") Derecho\"];";
        result += this.right.plot(Number(count + "21"));
        result += "node" + count + "2 -> " + "node" + count + "21;";

        // Flechas
        result += "node" + count + " -> " + "node" + count + "1;";
        result += "node" + count + " -> " + "node" + count + "2;";
        return result;
    }

    public translate(environment: Environment): String {
        let result = this.left.translate(environment);
        let rigthT = _Console.count - 1;
        result += "" + this.right.translate(environment);
        let leftT = _Console.count - 1;
        result += "t" + _Console.count + " = t" + leftT + this.getTypeSign() + "t" + rigthT + "\n";
        _Console.count++;
        return result;
    }

    public execute(environment: Environment): Retorno {
        const leftValue = (this.left == null) ? { value: null, type: 3 } : this.left.execute(environment);
        const rightValue = (this.right == null) ? { value: null, type: 3 } : this.right.execute(environment);

        if (leftValue == null || rightValue == null) errores.push(new Error_(this.line, this.column, 'Semantico', 'Operador no definido'));
        switch (this.type) {
            case ArithmeticOption.PLUS:
                switch (this.tipoDominante(leftValue.type, rightValue.type)) {
                    case Type.STRING:
                        return { value: (leftValue.value.toString() + rightValue.value.toString()), type: Type.STRING };
                    case Type.NUMBER:
                        return { value: (leftValue.value + rightValue.value), type: Type.NUMBER };
                    default:
                        errores.push(new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' _ ' + rightValue.type));
                }
            case ArithmeticOption.MINUS:
                switch (this.tipoDominante(leftValue.type, rightValue.type)) {
                    case Type.STRING:
                        errores.push(new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' _ ' + rightValue.type));
                    case Type.NUMBER:
                        return { value: (leftValue.value - rightValue.value), type: Type.NUMBER };
                    default:
                        errores.push(new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' _ ' + rightValue.type));
                }
            case ArithmeticOption.TIMES:
                switch (this.tipoDominante(leftValue.type, rightValue.type)) {
                    case Type.NUMBER:
                        return { value: (leftValue.value * rightValue.value), type: Type.NUMBER };
                    default:
                        errores.push(new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' _ ' + rightValue.type));
                }
            case ArithmeticOption.POWER:
                switch (this.tipoDominante(leftValue.type, rightValue.type)) {
                    case Type.NUMBER:
                        return { value: (Math.pow(leftValue.value, rightValue.value)), type: Type.NUMBER };
                    default:
                        errores.push(new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' _ ' + rightValue.type));
                }
            case ArithmeticOption.MOD:
                switch (this.tipoDominante(leftValue.type, rightValue.type)) {
                    case Type.NUMBER:
                        return { value: (leftValue.value % rightValue.value), type: Type.NUMBER };
                    default:
                        errores.push(new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' _ ' + rightValue.type));
                }
            default:
                switch (this.tipoDominante(leftValue.type, rightValue.type)) {
                    case Type.NUMBER:
                        if (rightValue.value == 0)
                            errores.push(new Error_(this.line, this.column, "Semantico", "No se puede dividir entre 0"));
                        return { value: (leftValue.value / rightValue.value), type: Type.NUMBER };
                    default:
                        errores.push(new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' _ ' + rightValue.type));
                }
        }
    }
}