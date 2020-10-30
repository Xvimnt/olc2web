function a(par: number) {
    b(par);
}

function b(par1:number) {
    c(par1);
}

function c(par2: number) {
    console.log(par2);
}

a(100);