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

    public plot(count: number): string {

        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Declaracion\";";

        // Hijo 1
        result += "node" + count + "1[label=\"(" + this.line + "," + this.column + ") Metodo\"];";
        result += this.method.plot(Number(count + "1"));
        // Hijo 2
        result += "node" + count + "2[label=\"(" + this.line + "," + this.column + ") Tipo\"];";
        result += this.method.plot(Number(count + "2"));
        // Hijo 3
        result += "node" + count + "3[label=\"(" + this.line + "," + this.column + ") ID\"];";
        result += this.method.plot(Number(count + "3"));
        // Hijo 4
        result += "node" + count + "4[label=\"(" + this.line + "," + this.column + ") Valor\"];";
        result += this.method.plot(Number(count + "4"));
        // Flechas
        result += "node" + count + " -> " + "node" + count + "1;";
        result += "node" + count + " -> " + "node" + count + "2;";
        result += "node" + count + " -> " + "node" + count + "3;";
        result += "node" + count + " -> " + "node" + count + "4;";

        return result;
    }

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