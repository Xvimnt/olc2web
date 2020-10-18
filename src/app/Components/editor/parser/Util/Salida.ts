class Console {
    public salida = "";
    public symbols = new Map();
    public count: number;
    public labels: number;
    public pila: any[];
    public heap: any[];

    constructor() {
        this.pila = new Array;
        this.heap = new Array;
    }

    saveInStack(index: number, id: string) {
        this.pila[index] = id;
    }
}
export const _Console = new Console();