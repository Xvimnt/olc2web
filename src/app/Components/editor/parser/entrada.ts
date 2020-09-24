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

  llenado(matrixA,matrixB, matrixR);
  console.log("Matrix A");
  console.log(matrixA);
  console.log("Matrix B");
  console.log(matrixB);
