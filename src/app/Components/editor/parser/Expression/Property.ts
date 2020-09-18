import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Retorno } from "../Abstract/Retorno";
import { Error_ } from "../Error";
import { errores } from '../Errores';
import { Symbol } from "../Symbol/Symbol";
import { Access } from './Access';


export class Property extends Expression {

    constructor(private id: any, private property: string, line: number, column: number) {
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
        if (this.id instanceof Access) {
            const val = this.id.execute(environment);
            for (let index in val.value) {
                if (val.value[index].id == this.property) {
                    if (val.value[index].value != null) {
                        let result = val.value[index].value.execute();
                        return { value: result.value, type: result.type }
                    }
                }
            }
        }
        return { value: null, type: 3 }
    }
}