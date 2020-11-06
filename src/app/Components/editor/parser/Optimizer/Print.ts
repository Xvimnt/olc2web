import { Expression } from '../Abstract/Expression';

export class Print {

    constructor(public content: string, public expression: Expression, line: number, column: number) { }

    optimize() {

    }
}