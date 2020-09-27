import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { env } from 'process';
import { isString } from 'util';

export class Return extends Instruction {

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Return\"];";;
        // Hijo 1
        result += "node" + count + "1[label=\"(" + this.value.line + "," + this.value.column + ") Valor\"];";
        result += this.value.plot(Number(count + "1"));
        // Flechas
        result += "node" + count + " -> " + "node" + count + "1;";
        return result;
    }

    constructor(public value: Expression, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment) {
        if (isString(this.value)) return { line: this.line, column: this.column, type: 'Return' };
        const result = this.value.execute(environment);
        console.log('regresando', result);
        console.log('DE', this.value);

        if (result != null) return { line: this.line, column: this.column, type: result.type, value: result.value };
        else return { type: 3, value: 'undefined' }
    }
}