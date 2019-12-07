export function parsePassword(source: string) {
    let returnedDigits: number[] = [];
    for (let digit of source) {
        returnedDigits.push(Number(digit));
    }
    return returnedDigits;
}

export function passwordValidates(digits: number[]): boolean {
    let previousDigit = 0; // impossible to be 0, since first digit starts with 1
    let adjacentDigitsPasses = false;

    for (let digit of digits) {
        // test 1: adjacent digits
        if (previousDigit === digit) {
            adjacentDigitsPasses = true;
        }

        // test 2: never decreases
        if (digit < previousDigit) {
            return false;
        }
        previousDigit = digit;
    }
    return adjacentDigitsPasses;
}

export function countPasswords(start: number, end: number) {
    let count = 0;
    for (let i = start; i <= end; i++) {
        if (passwordValidates(parsePassword(i.toString()))) {
            count++;
        }
    }
    return count;
}