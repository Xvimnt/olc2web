import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { _Console } from "../Util/Salida";
import { errores } from '../Errores';
import { Error_ } from '../Error';

export class Print extends Instruction{

    public plot(count: number): string {

        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Print\"];";
        // Hijo 1
        result += "node" + count + "1[label=\"(" + this.value.line + "," + this.value.column + ") Valor\"];";
        result += this.value.plot(Number(count + "1"));
        // Flechas
        result += "node" + count + " -> " + "node" + count + "1;";

        return result;
    }
    
    constructor(private value : Expression, line : number, column : number){
        super(line, column);
    }

    public execute(environment : Environment) {
        if(this.value.execute(environment) != undefined) {
            const resultado = this.value.execute(environment).value;
            _Console.salida += resultado + "\n";
        } else _Console.salida += "";
    }
}