import { _Optimizer } from './Optimizer';

export class Label {

    constructor(public label: string, line: number, column: number) { }
    regla1(env: _Optimizer) {
        if (env.label != this.label) {
            env.flag = false;
            env.salida += env.temp;
        }
        else if (!env.flag) env.salida += env.temp;
        
        env.temp = "";
        env.salida += this.label + ":\n";
    }
    optimize(env: _Optimizer) {

    }
}