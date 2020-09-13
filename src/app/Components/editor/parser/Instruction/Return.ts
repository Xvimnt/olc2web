import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";

export class Return extends Instruction{

    public plot(count: number): string {
        return "node" + count + "[label=\"(" + this.line + "," + this.column + ") Return\"];";;
    }
    
    constructor(line : number, column : number){
        super(line, column);
    }

    public execute(environment : Environment) {
        return {line : this.line, column: this.column, type : 'Return'};
    }
}