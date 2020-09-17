import { Expression } from "../Abstract/Expression";
import { Retorno, Type } from "../Abstract/Retorno";
import { Environment } from "../Symbol/Environment";
import { Error_ } from "../Error";


export class Ternary extends Expression {

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Ternaria\"];";
        // Hijos
        result += "node" + count + "1[label=\"(" + this.condition.line + "," + this.condition.column + ") Condicion\"];";
        result += this.condition.plot(Number(count + "1"));
        result += "node" + count + "2[label=\"(" + this.isTrue.line + "," + this.isTrue.column + ") Valor Verdadero\"];";
        result += this.isTrue.plot(Number(count + "2"));
        result += "node" + count + "3[label=\"(" + this.isFalse.line + "," + this.isFalse.column + ") Valor Verdadero\"];";
        result += this.isFalse.plot(Number(count + "3"));
        // Flechas
        result += "node" + count + " -> " + "node" + count + "1;";
        result += "node" + count + " -> " + "node" + count + "2;";
        result += "node" + count + " -> " + "node" + count + "3;";
        return result;
    }

    constructor(private condition: Expression, private isTrue: Expression, private isFalse: Expression, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment): Retorno {
        const condition = this.condition.execute(environment);

        if (condition.value == true) {
            const isTrue = this.isTrue.execute(environment);
            if (isTrue != null) return { type: isTrue.type, value: isTrue.value }
            else return { type: 3, value: 'undefined' }
        }
        else {
            const isFalse = this.isFalse.execute(environment);
            if (isFalse != null) return { type: isFalse.type, value: isFalse.value }
            else return { type: 3, value: 'undefined' }
        }
    }
}