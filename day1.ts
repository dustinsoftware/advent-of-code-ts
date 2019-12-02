export function fuel(mass: number) {
    return Math.floor(mass / 3) - 2;
}

export const getAllFuel = (input: string) =>
    input.split('\n')
    .map(Number)
    .filter(Boolean)
    .map(fuel)
    .reduce((prev, curr) => prev + curr, 0)

export const expensiveFuel = (mass: number) => {
    let next = mass;
    let accumulator = 0;
    while (true) {
        let result = fuel(next);
        next = result;
        if (result <= 0) {
            break;
        }
        accumulator += result;
    }

    return accumulator;
}

export const getAllExpensiveFuel = (input: string) =>
    input.split('\n')
    .map(Number)
    .filter(Boolean)
    .map(expensiveFuel)
    .reduce((prev, curr) => prev + curr, 0)
