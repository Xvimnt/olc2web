import { env } from "process"
import { Symbol } from "./Symbol";
import { Type } from "../Abstract/Retorno";
import { Function } from "../Instruction/Function";
import { isRegExp } from 'util';
import { errores } from '../Errores';
import { Error_ } from '../Error';
import { _Console } from '../Util/Salida';

export class Environment {

    public variables: Map<string, Symbol>;
    public funciones: Map<string, Function>;

    constructor(public anterior: Environment | null) {
        this.variables = new Map<string,Symbol>();
        this.funciones = new Map<string, Function>();
    }

    public guardar(id: string, valor: any, type: Type, skip = false) {
        let env: Environment | null = this;
        if (skip) {
            if (env.variables.has(id)) env.variables.delete(id);
            this.variables.set(id, new Symbol(valor, id, type));
        }
        else {
            while (env != null) {
                if (env.variables.has(id)) {
                    if (env.anterior == null) _Console.symbols.set(id, new Symbol(valor, id, type, 'Global'));
                    else _Console.symbols.set(id, new Symbol(valor, id, type, 'Local'));

                    env.variables.set(id, new Symbol(valor, id, type));
                    return;
                }
                env = env.anterior;
            }
            this.variables.set(id, new Symbol(valor, id, type));
        }
    }

    public guardarFuncion(id: string, funcion: Function) {
        if (this.funciones.has(id)) errores.push(new Error_(funcion.line, funcion.column, "Semantico", "Funcion ya definida"));
        else {
            _Console.symbols.set(id, new Symbol('Instrucciones', id, 8, 'Global'));
            this.funciones.set(id, funcion);
        }
    }

    public getVar(id: string): Symbol | undefined | null {
        let env: Environment | null = this;
        while (env != null) {
            if (env.variables.has(id)) {
                return env.variables.get(id);
            }
            env = env.anterior;
        }
        return null;
    }

    public getFuncion(id: string): Function | undefined {
        let env: Environment | null = this;
        while (env != null) {
            if (env.funciones.has(id)) {
                return env.funciones.get(id);
            }
            env = env.anterior;
        }
        return undefined;
    }

    public getGlobal(): Environment {
        let env: Environment | null = this;
        while (env.anterior != null) {
            env = env.anterior;
        }
        return env;
    }
}