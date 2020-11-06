import { _Optimizer } from './Optimizer';

export class Goto {

    constructor(public label: string, line: number, column: number) { }

    regla1(env: _Optimizer){
        env.label = this.label;
        env.flag = true;
        env.salida += "goto " + this.label + ";\n";
    }

    optimize(env: _Optimizer) {
        // Regla 1
         
    }
}