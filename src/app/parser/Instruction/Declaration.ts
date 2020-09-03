import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { Literal } from "../Expression/Literal";
import { isNumber, isString, isBoolean } from "util";

export class Declaration extends Instruction {

    private id: string;
    private value: Expression;
    private type: Literal;
    private method: Literal;

    constructor(method: Literal, type: Literal, id: string, value: Expression, line: number, column: number) {
        super(line, column);
        this.id = id;
        this.value = value;
        this.type = type;
        this.method = method;
    }

    public execute(environment: Environment) {
        if (this.value != null) {
            const val = this.value.execute(environment);
            switch (this.type.execute().value) {
                case 'number':
                    if (!isNumber(val.value)) throw new Error('Numero no valido');
                    break;
                case 'string':
                    if (!isString(val.value)) throw new Error('String no valida');
                    break;
                case 'boolean':
                    if (!isBoolean(val.value)) throw new Error('Booleano no valido');
                    break;
                case 'type': break;
                default:
                    console.log('usted guarda nada');
                    break;
            }
            environment.guardar(this.id, val.value, val.type);
        }
        else 
        {
            if(this.method.execute().value == 'const') throw new Error('Constante no puede ser vacia');
            environment.guardar(this.id, 'undefined', 3);
        }
    }

}