import { Expression } from "../Abstract/Expression";
export class Assignation {

    constructor(public id: string, public expr: Expression, line: number, column: number) { }

    optimize() {
        console.log('se esta optimizando');
    }
}