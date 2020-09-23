let matrixA : number [][] = [];
for(let i = 0; i < 2; i++) {
  matrixA[i] = [];
 for(let j =0; j < 2; j++) {
  matrixA[i][j] = i + j; 
 }
}
console.log(matrixA);