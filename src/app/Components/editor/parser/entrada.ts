type AVLNode = {
    left: AVLNode,
    right: AVLNode,
    height: number,
    value: number
};

type AVLTree = {
    root: AVLNode
};

let vari = 32;

let node : AVLNode = {
            left: null,
            right: null,
            height: 0,
            value: vari
};

console.log(node.value);