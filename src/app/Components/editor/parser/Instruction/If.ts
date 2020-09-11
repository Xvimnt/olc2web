import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Type } from "../Abstract/Retorno";

export class If extends Instruction{

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") If\"];";
        // Hijo 1
        result += "node" + count + "1[label=\"(" + this.condition.line + "," + this.condition.column + ") Condicion\"];";
        result += this.condition.plot(Number(count + "1"));
         // Hijo 2
         result += "node" + count + "2[label=\"(" + this.code.line + "," + this.code.column + ") Codigo\"];";
         result += this.code.plot(Number(count + "2"));
          // Hijo 3
        result += "node" + count + "3[label=\"(" + this.elsSt.line + "," + this.elsSt.column + ") ElseStatement\"];";
        result += this.elsSt.plot(Number(count + "3"));
        // Flechas
        result += "node" + count + " -> " + "node" + count + "1;";
        result += "node" + count + " -> " + "node" + count + "2;";
        result += "node" + count + " -> " + "node" + count + "3;";
        return result;
    }

    constructor(private condition : Expression, private code : Instruction, private elsSt : Instruction | null,
        line : number, column : number){
        super(line, column);
    }

    public execute(env : Environment) {
        const condition = this.condition.execute(env);
        if(condition.type != Type.BOOLEAN){
            throw {error: "La condicion no es booleana", linea: this.line, columna : this.column};
        }

        if(condition.value == true){
            return this.code.execute(env);
        }
        else{
            return this.elsSt?.execute(env);
        }
    }
}
