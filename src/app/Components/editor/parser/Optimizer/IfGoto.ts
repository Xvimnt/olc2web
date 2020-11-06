import { _Optimizer } from './Optimizer';

export class IfGoto{

    constructor(public condition: string,public label: string,line: number, column: number) { }
    
    build(): string {
        return  "if(" + this.condition + ") goto " + this.label + ";\n";
    }

    regla1(env: _Optimizer) {
        env.temp += this.build();
    }
    

    optimize(env: _Optimizer) {
        
    }
}