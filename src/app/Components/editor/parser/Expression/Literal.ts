import { Expression } from "../Abstract/Expression";
import { Retorno, Type, getTypeName } from "../Abstract/Retorno";
import { Environment } from "../Symbol/Environment";
import { Error_ } from "../Error";
import { errores } from '../Errores';

export class Literal extends Expression {

    constructor(private value: any, line: number, column: number, private type: number) {
        super(line, column);
    }
    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Literal\"];";
        return result;
    }

    private fixString(str: String) {
        let result = str;
        if (str.endsWith('"')) result = str.replace(/\"/g, "");
        if (str.endsWith("'")) result = str.replace(/\'/g, "");
        result = result.replace(/\\t/g,'  ');
        result = result.replace(/\\n/g,'\n');
        result = result.replace(/\\r/g,'\n');

        return result;
    }

    private stringTemplateParser(expression: string, environment: Environment) {
        const templateMatcher = /\${\s?([^{}\s]*)\s?}/g;
        let text = expression.replace(templateMatcher, (substring, value, index) => {
            value = environment.getVar(value);
            if (value == null)
                errores.push(new Error_(this.line, this.column, 'Semantico', 'Variable no definida'));
            return value.valor;
        });
        let result = text.replace(/`/g, "");
        result = result.replace(/\\t/g,'  ');
        result = result.replace(/\\n/g,'\n');
        result = result.replace(/\\r/g,'\n');
        return result;
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
                return { value: this.stringTemplateParser(this.value, environment), type: Type.STRING };
            default:
                return { value: this.value, type: Type.STRING };
        }
    }
}