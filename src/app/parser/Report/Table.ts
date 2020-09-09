
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
        //console.log(errores);
        let result = '<table class="table">\n';
        result += '<thead>\n<tr>\n<th scope="col">#</th>\n'
        result += '<th scope="col">Tipo</th>\n';
        result += '<th scope="col">Descripcion</th>\n';
        result += '<th scope="col">Linea</th>\n';
        result += '<th scope="col">Columna</th>\n';
        result += '<th scope="col">Ambito</th>\n';
        result += '</tr>\n';
        result += '</thead>\n';
        result += '<tbody>\n';

        let count = 1;
        errores.forEach(element => {
            result += '<tr>\n';
            result += '<th scope="row">'+count+'</th>\n';

            console.log(element);
            const error = element['message'].split(' ');
            result += '<td>' + error[0] + '</td>\n';
            result += '<td> ' + error[7] + '</td>\n';
            result += '<td>' + error[4] + '</td>\n';
            result += '<td>' + error[6] + '</td>\n';
            result += '<td>Global</td>\n';


            result += '</tr>\n';
            count++;
        });
        result += '</tbody>\n';
        return result += '</table>';
    }
}