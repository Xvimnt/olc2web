let matrixA : number [][] = [];
let matrixB : number [][] = [];
let matrixR : number [][] = [];
const min = 0;
const max = 4;

function llenado(matrix1 : number[][], matrix2 : number[][], matrix3 : number[][]) : void{
    for(let i = min; i < max; i++){
        matrix1[i] = [];
        matrix2[i] = [];
        matrix3[i] = [];
        for(let j = min; j < max; j++){
            matrix1[i][j] = j * 3 + i;
            matrix2[i][j] = i ** 3 - j ** 2;
            matrix3[i][j] = 0;
        }
    }
}

function suma(matrix1 : number[][], matrix2 : number[][], matrixR : number[][]): void{
    for(let i = min; i < max; i++){
        for(let j = min; j < max; j++){
            matrixR[i][j] = matrix1[i][j] + matrix2[i][j];
        }
    }
}

function sumarFilas(matrix : number[][]) : void{
    let contador = 0;
    console.log("\t\t\t\t\t\t\t\t\t\tR");
    for(let i = 0; i < matrix.length; i++){
        contador = 0;
        let salida = '';
        for(let j = 0; j < matrix[i].length; j++){
            contador = contador + matrix[i][j];
			salida = salida + "\t|\t" + matrix[i][j];
        }
        console.log(salida, "\t|\t",contador);
    }
}

function sumarColumnas(matrix : number[][]) : void{
    let contador = 0;
    let salida = 'R';
    for(let i = 0; i < matrix.length; i++){
        contador = 0;
        for(let j = 0; j < matrix[i].length; j++){
            contador = contador + matrix[j][i];
        }
        salida = salida + "\t|\t" +  contador;
    }
    console.log(salida);
}


function resta(matrix1 : number[][], matrix2 : number[][], matrixR : number[][]): void{
    for(let i = min; i < max; i++){
        for(let j = min; j < max; j++){
            matrixR[i][j] = matrix1[i][j] - matrix2[i][j];
        }
    }
}


function multiplicar(matrix1 : number[][], matrix2 : number[][], matrixR : number[][]): void{
    for(let i = min; i < max; i++){
        for(let j = min; j < max; j++){
            for(let k = min; k < max; k++){
                matrixR[i][j] = matrixR[i][j] + matrix1[i][k] * matrix2[k][j];
            }
        }
    }
}

function transpuesta(matrix1: number[][]): void{
    const matrixAux : number[][] = [];
    for(let i = 0; i < max; i++){
        matrixAux[i] = [];
        for(let j = 0; j < max; j++){
            matrixAux[i][j] = matrix1[j][i];
        }
    }
    for(let i = 0; i < max; i++){
        for(let j = 0; j < max; j++){
            matrix1[i][j] = matrixAux[i][j];
        }
    }
}

function minValue(matrix1 : number[][]) : number{   

    let iAux = 0;
    let jAux = 0;
    let temp = matrix1[min][min];
    for(let i = 0; i < matrix1.length; i++){
        for(let j = 0; j < matrix1[i].length; j++){
            if(matrix1[i][j] < temp){
                temp = matrix1[i][j];
                iAux = i;
                jAux = j;
            }
        }
    }
    console.log("Min -> [",iAux,",",jAux,"] = ",temp);
    return temp;
}

function maxValue(matrix1 : number[][]) : number{   
    let iAux = 0;
    let jAux = 0;
    let temp = matrix1[min][min];
    for(let i = 0; i < matrix1.length; i++){
        for(let j = 0; j < matrix1[i].length; j++){
            if(matrix1[i][j] > temp){
                temp = matrix1[i][j];
                iAux = i;
                jAux = j;
            }
        }
    }
    console.log("Max -> [",iAux,",",jAux,"] = ",temp);
    return temp;
}

function ordenar(matrix1 : number[][]): void{
    let aux = 0;
    for(let i = 0; i < matrix1.length; i++){
        for(let j = 0; j < matrix1[i].length; j++){
            for(let k = 0; k <= i; k++){
                for(let l = 0; l <= j; l++){
                    if(matrix1[i][j] < matrix1[k][l]){
                        aux = matrix1[i][j];
                        matrix1[i][j] = matrix1[k][l];
                        matrix1[k][l] = aux;
                    }
                }
            }
        }
    }
}

function clearMat(matrix : number[][]): void{
    for(let i = 0; i < matrix.length; i++){
        for(let j = 0; j < matrix[i].length; j++){
            matrix[i][j] = 0;
        }
    }
}


llenado(matrixA,matrixB, matrixR);
console.log("Matrix A");
console.log(matrixA);
console.log("Matrix B");
console.log(matrixB);

console.log("MatR = MatA + MatB");
suma(matrixA,matrixB,matrixR);
console.log(matrixR);

console.log("MatR = MatA - MatB");
resta(matrixA,matrixB,matrixR);
console.log(matrixR);

console.log("Clear MatR");
clearMat(matrixR);
console.log(matrixR);

console.log("MatR = MatA * MatB");
multiplicar(matrixA,matrixB,matrixR);
console.log(matrixR);

console.log("Tranpose(MatA)");
transpuesta(matrixA);
console.log(matrixA);

minValue(matrixR);
maxValue(matrixR);

console.log("Sort MatR");
ordenar(matrixR);
console.log(matrixR);

minValue(matrixR);
maxValue(matrixR);

console.log("Suma Filas y Columnas");
sumarFilas(matrixA);
sumarColumnas(matrixA);