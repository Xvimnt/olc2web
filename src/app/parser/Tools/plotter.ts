
export class Plotter {

    public makeDot(ast: any) {
        let result = "diagraph AST{";
        let count = 0;
        if (ast != null) {
            for (const instr of ast) {
                result += "node" + count + "[label=\"Tipo:" + instr + "\"];";
                count++;
                console.log(instr);
            }
        }
        return result + "}";
    }
}