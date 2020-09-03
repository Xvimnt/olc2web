import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";

export class Print extends Instruction{

    constructor(private value : Expression, line : number, column : number){
        super(line, column);
    }

    public execute(environment : Environment) {
        console.log(this.value.execute(environment).value);
    }
}