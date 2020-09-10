import { env } from "process"
import { Symbol } from "./Symbol";
import { Type } from "../Abstract/Retorno";
import { Function } from "../Instruction/Function";

export class Environment {

    public variables: Map<string, Symbol>;
    public funciones: Map<string, Function>;
    private result: string;

    constructor(public anterior: Environment | null) {
        this.variables = new Map();
        this.funciones = new Map();
        this.result = "";
    }

    public concate(value: string) {
        if (this.result != null) this.result += value + "\n";
        else this.result = value + "\n";
    }

    public getResult() {
        return this.result
    }

    public cleanResult() {
        this.result = "";
    }

    public guardar(id: string, valor: any, type: Type) {
        let env: Environment | null = this;
        while (env != null) {
            if (env.variables.has(id)) {
                env.variables.set(id, new Symbol(valor, id, type));
                return;
            }
            env = env.anterior;
        }
        this.variables.set(id, new Symbol(valor, id, type));
    }

    public guardarFuncion(id: string, funcion: Function) {
        //TODO ver si la funcion ya existe, reportar error
        this.funciones.set(id, funcion);
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
        while (env?.anterior != null) {
            env = env.anterior;
        }
        return env;
    }
}