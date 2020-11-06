import { Expression } from "../Abstract/Expression";
import { _Optimizer } from './Optimizer';
export class ArrayAssignation {

    constructor(public id: string, public index: string, public expr: Expression, line: number, column: number) { }

    build(): string {
        return this.id + "[" + this.index + "] = " + this.expr + ";\n";
    }

    regla1(env: _Optimizer) {
        env.temp += this.build();
    }
    
    optimize(env: _Optimizer) {
        console.log('se esta optimizando');
    }
}