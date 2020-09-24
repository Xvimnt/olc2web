import { _Type } from '../Types/Type';
import { Type } from '@angular/core';

export class _Struct {

    constructor(private content: Type<any>, public tipo: _Type) { }

    public getAtributo(index: string) {
        return this.content[index];
    }

    public setAtributo(index: string, value: any) {
        this.content[index] = value;
    }

    public print() {
        let result = "[ ";
        console.log('imprimiendo ',this.content)
        if(result.length > 2) result = result.substring(0, result.length - 2);
        return result += " ]";
    }

}