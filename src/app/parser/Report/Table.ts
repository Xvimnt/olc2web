
import { Error_ } from "../Error";
import { Environment } from '../Symbol/Environment';

export class Table {

    public symbols(env: Environment) {
        console.log(env);
        let result = '<table class="table">\n';

        env.variables.forEach(element => {
            console.log(element);
        });

        return result += '</table>';
    }

    public errors(errores: Array<Error_>) {
        console.log(errores);
        let result = '<table class="table">\n';

        errores.forEach(element => {
            console.log(element);
        });

        return result += '</table>';
    }
}