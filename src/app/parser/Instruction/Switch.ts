import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";

export class Switch extends Instruction {

    constructor(private condition: Expression, private stack: any, private def: any,
        line: number, column: number) {
        super(line, column);
    }

    public execute(env: Environment) {
        if (this.stack != null) {
            const condition = this.condition.execute(env);
            this.stack.forEach((element: any) => {
                const compare = element['condicion'].execute(env);
                if(condition.value == compare.value) {
                    element['instruccion'].forEach((element2: any) => {
                        element2.execute(env);
                    });
                    //TODO Si se ejecuta el case no ejecutar el default
                    return;
                }
            });
            if(this.def != null) return this.def.execute(env);
        }
    }
}



/*
    PADRE <- HIJO <- IF
    PADRE <- HIJO <- WHILE
*/