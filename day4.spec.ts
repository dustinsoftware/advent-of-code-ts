import { parsePassword, passwordValidates, countPasswords } from './day4';

test('passwordValidates', () => {
    expect(passwordValidates(parsePassword('111111'))).toBe(true);
    expect(passwordValidates(parsePassword('111110'))).toBe(false);
    expect(passwordValidates(parsePassword('123456'))).toBe(false);
    expect(passwordValidates(parsePassword('223450'))).toBe(false);
    expect(passwordValidates(parsePassword('123789'))).toBe(false);
});

test('countPasswords', () => {
    expect(countPasswords(111111, 111112)).toBe(2);
    expect(countPasswords(152085, 670283)).toBe(1764);
})

