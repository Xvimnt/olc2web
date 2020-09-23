import { _Type } from '../Types/Type';
import { Retorno } from '../Abstract/Retorno';

export class _Array {

    constructor(private dimensions: number, private content: Array<any>, public tipo: _Type) { }

    public getAtributo(id: string) {
        return this.content[id];
    }

    public setAtributo(index: number, value: any) {
        this.content[index] = value;
    }

    public pop() {
        return this.content.pop();
    }


}