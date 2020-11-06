import { Expression } from '../Abstract/Expression';
import { _Optimizer } from './Optimizer';

export class Print {

    constructor(public content: string, public expression: Expression, line: number, column: number) { }

    build(): string {
        return "printf(" + this.content + ");\n";
    }

    regla1(env: _Optimizer) {
        env.temp += this.build();
    }

    optimize(env: _Optimizer) {

    }
}