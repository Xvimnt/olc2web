import { Expression } from '../Abstract/Expression';
import { _Optimizer } from './Optimizer';

export class Return {

    constructor(line: number, column: number) { }
    
    regla1(env: _Optimizer) {
        env.salida += env.temp;
        env.temp = "";
    }
    
    optimize(env: _Optimizer) {

    }
}