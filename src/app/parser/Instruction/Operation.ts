import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";

export enum OperationOption {
    INCREMENT,
    DECREMENT
}

export class Operation extends Instruction {

    constructor(private id: string, private option: OperationOption, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment) {
        const value = environment.getVar(this.id);
        if(value == null)
            throw new Error("La variable no existe");
        environment.guardar(this.id,value.valor + 1, value.type);
    }
}
