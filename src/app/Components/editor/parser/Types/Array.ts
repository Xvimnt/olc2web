import { Expression } from "../Abstract/Expression";
import { Retorno, Type, getTypeName } from "../Abstract/Retorno";
import { _Type } from './Type';

export class ArrayType extends Expression {

    constructor(public type: _Type, public dimensions: number, line: number, column: number) {
        super(line, column);
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Tipo: " + this.type.execute().value + " Array de " + this.dimensions + " Dimensiones\"];";
        return result;
    }

    public execute(): Retorno {
        return { value: this.dimensions, type: this.type.execute().type };
    }
}