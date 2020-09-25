
    type AVLNode = {
        left: AVLNode,
        right: AVLNode,
        height: number,
        value: number
    };

    type AVLTree = {
        root: AVLNode
    };


    let tree: AVLTree = {
        root: null
    };

    let node: AVLNode = {
        left: null,
        right: null,
        height: 0,
        value: 5
    };
    tree.root = node;
    tree.root.value = 30;
    console.log(tree);