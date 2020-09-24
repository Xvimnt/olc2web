function swap(i: number, j: number, array: number[]): void {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

function bubbleSort(array: number[]): void {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - 1; j++) {
            if (array[j] > array[j + 1]) {
                swap(j, j + 1, array);
            }
        }
    }
}

function getPivot(value: number): number {
    return value % 2 == 0 ? value : value - 0.5;
}

function quickSort(low: number, high: number, array: number[]): void {
    let i = low;
    let j = high;
    let pivot = array[getPivot((low + high) / 2)];

    while (i <= j) {
        while (array[i] < pivot) {
            i++;
        }

        while (array[j] > pivot) {
            j--;
        }
        if (i <= j) {
            swap(i, j, array);
            i++;
            j--;
        }
    }

    if (low < j) {
        quickSort(low, j, array);
    }
    if (i < high) {
        quickSort(i, high, array);
    }
}

function insertionSort(array: number[]): void {
    for (let i = 1; i < array.length; i++) {
        let j = i;
        let temp = array[i];
        while (j > 0 && array[j - 1] > temp) {
            array[j] = array[j - 1];
            j--;
        }
        array[j] = temp;
    }
}


function selectionSort(array: number[]): void {
    for (let j = 0; j < array.length; j++) {
        let iMin = j;
        for (let i = j + 1; i < array.length; i++) {
            if (array[i] < array[iMin]) {
                iMin = i;
            }
        }
        swap(j, iMin, array);
    }
}

function merge(array: number[], l: number, m: number, r: number): void {
    console.log('entrando aca');
  	
}
function mergeSort(array: number[], l: number, r: number): void {
    if (l >= r) {
        return;
    }
    let m = getPivot((l + r) / 2);
	console.log('aca');
    mergeSort(array, l, m);
	console.log('aca');
    mergeSort(array, m + 1, r);
	console.log('antes de merge');
    merge(array, l, m, r);
	console.log('luego de merge');

}


let array: number[] = [32, 21, 7];
//bubbleSort(array);
//console.log('BubbleSort: ', array);

// quickSort(0, array.length - 1, array);
// console.log('QuickSort: ', array);

// insertionSort(array);
// console.log('InsertionSort', array);

// selectionSort(array);
// console.log('SelectionSort', array);

mergeSort(array, 0, array.length - 1);
//console.log('MergeSort: ', array);