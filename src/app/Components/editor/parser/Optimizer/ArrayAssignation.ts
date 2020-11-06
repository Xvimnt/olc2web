import { Expression } from "../Abstract/Expression";
export class ArrayAssignation {

    constructor(public id: string, public index: string, public expr: Expression, line: number, column: number) { }

    optimize() {
        console.log('se esta optimizando');
    }
}