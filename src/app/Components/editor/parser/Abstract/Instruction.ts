import { Environment } from "../Symbol/Environment";

export abstract class Instruction {

    public line: number;
    public column: number;

    constructor(line: number, column: number) {
        this.line = line;
        this.column = column;
    }

    public abstract execute(environment : Environment) : any;
    public abstract plot(count: number) : string;
    public abstract translate(environment: Environment) : String;
}