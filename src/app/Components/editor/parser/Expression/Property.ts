import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Retorno } from "../Abstract/Retorno";
import { Error_ } from "../Error";
import { errores } from '../Errores';
import { Symbol } from "../Symbol/Symbol";


export class Property extends Expression {

    constructor(private id: string, private property: string, line: number, column: number) {
        super(line, column);
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") " + this.id + ": Acceso\";";
        return result;
    }

    private getTypeProperty(variable: Symbol, property: string) {
        console.log('obteniendo ' + property + ' de ' + variable);
    }

    public execute(environment: Environment): Retorno {
        const value = environment.getVar(this.id);
        if (value == null)
            errores.push(new Error_(this.line, this.column, 'Semantico', 'Variable no definida'));
        else{
            let result = this.getTypeProperty(value,this.property);
            return null;
        }
    }
}