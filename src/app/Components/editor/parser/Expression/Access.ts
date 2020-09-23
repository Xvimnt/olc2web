import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Retorno } from "../Abstract/Retorno";
import { Error_ } from "../Error";
import { errores } from '../Errores';
import { isArray } from 'util';
import { _Array } from '../Object/Array';
import { Literal } from './Literal';
import { element } from 'protractor';

export class Access extends Expression {

    constructor(private id: any, line: number, column: number) {
        super(line, column);
    }

    public getID() { return this.id }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") " + this.id + ": Acceso\";";
        return result;
    }

    public execute(environment: Environment): Retorno {
        if (isArray(this.id)) {
            // Si es un array
            const value = environment.getVar(this.id[0]);
            if (value.valor instanceof _Array) {
                for (const key in this.id[1]) {
                    let index: string = this.id[1][key].value;
                    const retorno = value.valor.getAtributo(index);
                    if (retorno != undefined) return { value: retorno.value, type: retorno.type }
                }
            }
        }
        else {
            const value = environment.getVar(this.id);
            if (value == null)
                errores.push(new Error_(this.line, this.column, 'Semantico', 'Variable no definida'));
            else if (value.valor instanceof _Array) {
                return { value: value.valor.print(), type: 4 }
            }
            else return { value: value.valor, type: value.type };
        }
    }
}