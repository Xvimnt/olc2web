import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";

export enum OperationOption {
    INCREMENT,
    DECREMENT
}

export class Operation extends Instruction {

    private getName() {
        switch (this.option) {
            case OperationOption.INCREMENT: return "++";
            case OperationOption.DECREMENT: return "--";
        }
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Operacion:"
            + this.id + this.getName() + "\"];";
        return result;
    }

    constructor(private id: string, private option: OperationOption, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment) {
        const value = environment.getVar(this.id);
        if (value == null)
            throw new Error("La variable no existe");
        environment.guardar(this.id, value.valor + 1, value.type);
    }
}
