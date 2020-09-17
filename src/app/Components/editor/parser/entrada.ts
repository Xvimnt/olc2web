type AVLNode = {
    left: AVLNode,
    right: AVLNode,
    height: number,
    value: number
};

let node : AVLNode = {
    left: null,
    right: null,
    height: null,
    value: null,
};

console.log(node.height);