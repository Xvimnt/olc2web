
export class Plotter {
    count: number;
    public makeDot(ast: any) {
        let count = 1;
        let result = "digraph AST{ node[shape=\"box\"];";
        result += "node" + count + "[label=\"(0,0) Inicio\"];";
        if (ast != null) {
            for (const instr of ast) {
                result += instr.plot(Number(count + '1'));
                // Flechas
                result += "node1 -> " + "node" + count + "1;";
                count++;
            }
        }
        return result + "}";
    }
}