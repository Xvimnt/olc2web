import { Expression } from "../Abstract/Expression";
import { Retorno, Type, getTypeName } from "../Abstract/Retorno";

export class _Type extends Expression {

    constructor(private name: string, private type: number, line: number, column: number) {
        super(line, column);
    }
    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Tipo:" + this.name + "\"];";

        return result;
    }

    public execute(): Retorno {
        return { value: this.name, type: this.type };
    }
}