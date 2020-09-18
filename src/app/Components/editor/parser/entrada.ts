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
    value: null
};

node = {
    left: null,
    right: null,
    height: 6,
    value: 8
};

console.log(node.height);