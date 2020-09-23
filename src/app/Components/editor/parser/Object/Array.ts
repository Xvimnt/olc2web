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

    public print() {
        let result = "[ ";
        this.content.forEach(element => {
            result += element + ", ";
        });
        result = result.substring(0, result.length - 2);
        return result += " ]";
    }

    public pop() {
        return this.content.pop();
    }


}