function a(par1: number)
{
    b(par1);
}

function b(par2: number) 
{
    console.log(par2);
}

a(2);

/*
    void main()
    {
        t0 = p + 0;
        stack[t0] = 2;
        a();
    }

    void a() {
        t1 = p + 0;
        t2 = stack[t1]
        t3 = p + 1;
        stack[t3] = t2;
        b();
    }

    void b() {
        t4 = p + 0;
        t5 = stack[t4];
        printf("%i", t5);
    }

*/