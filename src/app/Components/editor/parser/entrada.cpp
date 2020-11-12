let index = 0;
while (index >= 0) {
    if (index == 0) {
        index = index + 100;
    } else if (index > 50) {
        index = index / 2 - 25;
    } else {
        index = (index / 2) - 1;
    }

    console.log(index);
}