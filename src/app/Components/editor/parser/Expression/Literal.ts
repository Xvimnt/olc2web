import { Expression } from "../Abstract/Expression";
import { Retorno, Type, getTypeName } from "../Abstract/Retorno";
import { Environment } from "../Symbol/Environment";
import { environment } from 'src/environments/environment';
import { Error_ } from "../Error";

export class Literal extends Expression {

    constructor(private value: any, line: number, column: number, private type: number) {
        super(line, column);
    }
    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Literal\"];";
        result += "node" + count + "1[label=\"(" + this.line + ","
            + this.column + ") " + this.value + ": " + getTypeName(this.type) + "\"];";
        // Flechas
        result += "node" + count + " -> " + "node" + count + "1;";
        return result;
    }

    private fixString(str: String) {
        if (str.endsWith('"')) return str.replace(/\"/g, "");
        if (str.endsWith("'")) return str.replace(/\'/g, "");
        return str;
    }

    private stringTemplateParser(expression: string, environment: Environment) {
        const templateMatcher = /\${\s?([^{}\s]*)\s?}/g;
        let text = expression.replace(templateMatcher, (substring, value, index) => {
            value = environment.getVar(value);
            if (value == null)
                throw new Error_(this.line, this.column, 'Semantico', 'Variable no definida');
            return value.valor;
        });
        return text.replace(/`/g, "");
    }

    public execute(environment: Environment): Retorno {
        switch (this.type) {
            case 0:
                return { value: Number(this.value), type: Type.NUMBER };
            case 1:
                return { value: this.fixString(this.value), type: Type.STRING };
            case 2:
                return { value: (this.value == 'false') ? false : true, type: Type.BOOLEAN };
            case 6:
                return { value: this.stringTemplateParser(this.value,environment), type: Type.STRING };
            default:
                return { value: this.value, type: Type.STRING };
        }
    }
}