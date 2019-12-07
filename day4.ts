export function parsePassword(source: string) {
    let returnedDigits: number[] = [];
    for (let digit of source) {
        returnedDigits.push(Number(digit));
    }
    return returnedDigits;
}

export function passwordValidates(source: string): boolean {
    const digits = parsePassword(source);
    let previousDigit = 0; // impossible to be 0, since first digit starts with 1
    let adjacentDigitCount = 0;
    let adjacentDigits: number[] = [];

    for (let digit of digits) {
        // test 1: adjacent digits
        if (previousDigit === digit) {
            adjacentDigitCount++;
        } else {
            if (adjacentDigitCount !== 0) {
                adjacentDigits.push(adjacentDigitCount);
            }
            adjacentDigitCount = 0;
        }

        // test 2: never decreases
        if (digit < previousDigit) {
            return false;
        }
        previousDigit = digit;
    }

    // consider last digit
    if (adjacentDigitCount !== 0) {
        adjacentDigits.push(adjacentDigitCount);
    }

    // test 3: any number must only repeat one time
    return (
        adjacentDigits.filter(x => x === 1).length !== 0
    );
}

export function countPasswords(start: number, end: number) {
    let count = 0;
    for (let i = start; i <= end; i++) {
        if (passwordValidates(i.toString())) {
            count++;
        }
    }
    return count;
}

