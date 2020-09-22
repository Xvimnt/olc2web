import { _Type } from '../Types/Type';

export class _Array {

    constructor(private dimensions: number, private content: Array<any>, public tipo: _Type) {  }

    getAtributo(id: string) {
        return this.content[id];
    }



}