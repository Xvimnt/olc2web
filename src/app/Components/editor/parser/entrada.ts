type AVLNode = {
    left: AVLNode,
    right: AVLNode,
    height: number,
    value: number
};

type AVLTree = {
    root: AVLNode
};


let tree : AVLTree = {
    root: null
};

console.log(tree);