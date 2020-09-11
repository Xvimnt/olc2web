import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";

export class Return extends Instruction{

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
    
    constructor(line : number, column : number){
        super(line, column);
    }

    public execute(environment : Environment) {
        return {line : this.line, column: this.column, type : 'Return'};
    }
}