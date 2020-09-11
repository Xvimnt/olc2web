import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Type } from "../Abstract/Retorno";

export class Foreach extends Instruction {

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
    
    constructor(private element: Expression, private array: Expression,
        private code: Instruction, line: number, column: number) {
        super(line, column);
    }

    public execute(env: Environment) {
        
    }
}