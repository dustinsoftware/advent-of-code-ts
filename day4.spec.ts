import { parsePassword, passwordValidates, countPasswords } from './day4';

test('passwordValidates', () => {
    expect(passwordValidates('123455')).toBe(true);
    expect(passwordValidates('123444')).toBe(false);
    expect(passwordValidates('111122')).toBe(true);
    expect(passwordValidates('112222')).toBe(true);
});

test('countPasswords', () => {
    expect(countPasswords(111111, 111112)).toBe(0);
    expect(countPasswords(111111, 222222)).toBe(898);
    // expect(countPasswords(152085, 670283)).toBe(1196);
});
