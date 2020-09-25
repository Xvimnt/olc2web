type AVLNode = {
    left: AVLNode,
    right: AVLNode,
    height: number,
    value: number
};

type AVLTree = {
    root: AVLNode
};

function height(n: AVLNode): number {
    if (n == null) {
        return 0;
    }
    return n.height;
}

function insert(node: AVLNode, value: number) :AVLNode {
    /* 1.  Perform the normal BST rotation */
    if (node == null) {
        node = {
            left: null,
            right: null,
            height: 0,
            value: value
        };
        return node;
    }

    if (value < node.value) {
        node.left = insert(node.left, value);
    } else {
        node.right = insert(node.right, value);
    }

    return node;
}



let tree : AVLTree = {
    root: null
};

tree.root = insert(tree.root, 19);
console.log(tree.root);
// preOrder(tree.root);