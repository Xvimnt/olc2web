import { Expression } from "../Abstract/Expression";
import { _Optimizer } from './Optimizer';
export class Assignation {

    constructor(public id: string, public expr: Expression, line: number, column: number) { }
    
    build(): string {
        return this.id + " = " + this.expr.build() + ";\n";
    }

    regla1(env: _Optimizer) {
        env.temp += this.build();
    }
    
    optimize(env: _Optimizer) {
        console.log('se esta optimizando');
    }
}