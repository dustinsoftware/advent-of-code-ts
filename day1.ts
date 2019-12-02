export function fuel(mass: number) {
    return Math.floor(mass / 3) - 2;
}

export const getAllFuel = (input: string) =>
    input.split('\n')
    .map(Number)
    .filter(Boolean)
    .map(A)
    .reduce((prev, curr) => prev + curr, 0)
