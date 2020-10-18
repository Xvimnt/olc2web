function prueba(num1: number) : number
{
  let result = 3 + 6 * num1;
  return result;
}

let num1 = 32;
let result = 3 + 6 * num1;

/*
  --------------------------
  0 - int num1 - par1
  1 - int result - local1
  2 - int - retorno
  --------------------------

  void prueba {
    t1 = p + 0
    t2 = pila[t1]
    t3 = 6 * t2
    t4 = 3 + t3
    t5 = p + 1
    pila[t5] = t4

    t6 = p + 1
    t7 = pila[t6]
    t8 = p + 2
    pila[t8] = t7
  }

*/