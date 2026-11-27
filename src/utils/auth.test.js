import { login, logout, getCurrentUser } from './auth';

// Start every test logged out
beforeEach(() => sessionStorage.clear());

test('logs in the doctor with the right password', () => {
  const result = login('doctor', '1234', 'doctor');
  expect(result.ok).toBe(true);
  expect(getCurrentUser().role).toBe('doctor');
});

test('rejects a wrong password', () => {
  expect(login('doctor', 'wrong', 'doctor').ok).toBe(false);
  expect(getCurrentUser()).toBeNull();
});

test('rejects a nurse account on the doctor tab', () => {
  expect(login('nurse', '1234', 'doctor').ok).toBe(false);
});

test('logout clears the user', () => {
  login('nurse', '1234', 'nurse');
  logout();
  expect(getCurrentUser()).toBeNull();
});