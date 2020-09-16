import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { Error_ } from "../Error";

export class Call extends Instruction {
    public plot(count: number): string {

        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Llamada\"];";

        // Hijo 1
        result += "node" + count + "1[label=\"(" + this.line + "," + this.column + ") ID: " + this.id + "\"];";
        // Hijo 2
        result += "node" + count + "2[label=\"(" + this.line + "," + this.column + ") Statement\"];";
        // Flechas
        result += "node" + count + " -> " + "node" + count + "1;";
        result += "node" + count + " -> " + "node" + count + "2;";

        return result;
    }

    constructor(private id: string, private expresiones: Array<Expression>, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: Environment) {
        const func = environment.getFuncion(this.id);
        if (func != undefined) {
            const newEnv = new Environment(environment.getGlobal());
            for (let i = 0; i < this.expresiones.length; i++) {
                const value = this.expresiones[i].execute(environment);
                newEnv.guardar(func.parametros[i], value.value, value.type);
            }
            let result = func.statment.execute(newEnv);
            // si no es Void
            if (func.type != null) {
                if (result != null) {
                    if (result.type == func.type.execute().type) return result;
                    else throw new Error_(this.line, this.column, 'Semantico', 'Return y funcion de diferente tipo, se requiere:' + func.type.execute().type + " ,se retorna: " + result.type + " " + result.value);
                } else throw new Error_(this.line, this.column, 'Semantico', 'La funcion no retorna nada');
            }

        } else throw new Error_(this.line, this.column, 'Semantico', 'Funcion no definida');
    }
}
