import { fuel, getAllFuel } from './day1';

test('should work', () => {
    expect(fuel(12)).toBe(2);
    expect(fuel(14)).toBe(2);
    expect(fuel((1969))).toBe(654);
    expect(fuel((100756))).toBe(33583);
});

test('summarize fuel', () => {
    expect(getAllFuel(`12
    14`)).toBe(4);
});
