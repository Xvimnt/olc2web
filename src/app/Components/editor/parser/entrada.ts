type AVLNode = {
    left: AVLNode,
    right: AVLNode,
    height: number,
    value: number
};

type AVLTree = {
    root: AVLNode
};


let node : AVLNode = {
            left: null,
            right: null,
            height: 0,
            value: 8
};

console.log(node.value);