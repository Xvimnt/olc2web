import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Type } from "../Abstract/Retorno";

export class For extends Instruction {

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
    
    constructor(private declaration: Instruction, private condition: Expression,
        private operation: Instruction, private code: Instruction, line: number,
        column: number) {
        super(line, column);
    }

    public execute(env: Environment) {
        this.declaration.execute(env);
        let condition = this.condition.execute(env);
        
        if (condition.type != Type.BOOLEAN) {
            throw { error: "La condicion no es booleana", linea: this.line, columna: this.column };
        }
        while (condition.value == true) {
            const element = this.code.execute(env);
            if (element != null || element != undefined) {
                console.log(element);
                if (element.type == 'Break')
                    break;
                else if (element.type == 'Continue')
                    continue;
            }

            this.operation.execute(env);
            condition = this.condition.execute(env);
            if (condition.type != Type.BOOLEAN) {
                throw { error: "La condicion no es booleana", linea: this.line, columna: this.column };
            }
        }
    }
}