
export class Plotter {

    public makeDot(ast: any) {
        let result = "digraph AST{ node[shape=\"box\"];";
        let count = 0;
        if (ast != null) {
            for (const instr of ast) {
                result += "node" + count + "[label=\"(" + instr.line + "," + (Number(instr.column) + 1) + ") " + instr.constructor.name + "\"];";
                result += this.traverseAst(count, instr.value);
            }
        }
        return result + "}";
    }

    private traverseAst(count: number, list: any) {
        if (list == null) return "";
        
        let result = "node" + (count + 1) + "[label=\"(" + list.line + "," + (Number(list.column) + 1) + ") " + list.constructor.name + "\"];";
        result += "node" + count + " -> node" + (count + 1) + ";";

        return result;
    }
}