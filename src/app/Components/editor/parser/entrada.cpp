function a(par: number) {
    b(par);
}

function b(par:number) {
    c(par);
}

function c(par: number) {
    console.log(par);
}

a(100);