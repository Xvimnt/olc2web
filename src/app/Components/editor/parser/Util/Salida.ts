class Console {
    public salida = "";
    public symbols = new Map();
    public count: number;
    public labels: number;
    public stackPointer: number;
    public heapPointer: number;
    public pila: any[];
    public stack: any[];
    public heap: any[];

    constructor() {
        this.pila = new Array;
        this.stack = new Array;
        this.heap = new Array;
    }
    showSystem(){
        console.log('----------- Stack -----------');
        console.table(this.stack);
        console.log('----------- Pila -----------');
        console.table(this.pila);
        console.log('----------- Heap -----------');
        console.table(this.heap);
        console.log('----------- Stack Pointer -----------');
        console.log(this.stackPointer);
        console.log('----------- Heap Pointer -----------');
        console.log(this.heapPointer);
    }
    saveInHeap(index: number, id: any) {
        this.heap[index] = id;
    }
    saveInStack(index: number, id: any) {
        this.stack[index] = id;
    }
    saveInPila(index: number, id: any) {
        this.pila[index] = id;
    }

    
}
export const _Console = new Console();