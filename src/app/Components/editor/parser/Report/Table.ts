
import { Error_ } from "../Error";
import { Environment } from '../Symbol/Environment';

export class Table {

    public symbols(env: Environment) {
        let result = '<table class="table">\n';

        result += '<thead>\n<tr>\n<th scope="col">#</th>\n'
        result += '<th scope="col">Valor</th>\n';
        result += '<th scope="col">ID</th>\n';
        result += '<th scope="col">Tipo</th>\n';
        result += '</tr>\n';
        result += '</thead>\n';
        result += '<tbody>\n';

        let count = 1;
        env.variables.forEach(element => {
            result += '<tr>\n';
            result += '<th scope="row">' + count + '</th>\n';
            result += element.htmlRow();
            result += '</tr>\n';
            count++;
        });
        env.funciones.forEach(element => {
            result += '<tr>\n';
            result += '<th scope="row">' + count + '</th>\n';
            result += element.htmlRow();
            result += '</tr>\n';
            count++;
        });
        result += '</tbody>\n';
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
        result += '</tr>\n';
        result += '</thead>\n';
        result += '<tbody>\n';

        let count = 1;
        errores.forEach(element => {
            result += '<tr>\n';
            result += '<th scope="row">' + count + '</th>\n';
            result += element.htmlRow();
            result += '</tr>\n';
            count++;
        });
        result += '</tbody>\n';
        return result += '</table>';
    }
}