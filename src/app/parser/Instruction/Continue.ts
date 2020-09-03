import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";

export class Continue extends Instruction{

    constructor(line : number, column : number){
        super(line, column);
    }

    public execute(environment : Environment) {
        return {line : this.line, column: this.column, type : 'Continue'};
    }
}