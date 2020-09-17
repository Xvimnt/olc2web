
function modulo(n : number, p : number) : number{
    return n < p ? n : modulo(n - p, p);
}

function mcd(a : number, b : number) : number{
    return b == 0 ? a : mcd(b, modulo(a, b));
}

console.log(mcd(240,506)); //2