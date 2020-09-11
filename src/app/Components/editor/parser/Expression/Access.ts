import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Retorno } from "../Abstract/Retorno";

export class Access extends Expression{

    constructor(private id: string, line : number, column: number){
        super(line, column);
    }
    
    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") "+this.id+": Acceso\";";
        return result;
    }

    public execute(environment: Environment): Retorno {
        const value = environment.getVar(this.id);
        if(value == null)
            throw new Error("La variable no existe");
        return {value : value.valor, type : value.type};
    }
}