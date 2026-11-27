// Fake login for now (no backend). The logged-in user is saved in localStorage
// so a page refresh does not log you out.
import { users } from '../data/mockData';

const KEY = 'resortClinicUser';

export function login(username, password, role) {
  const user = users.find(
    (u) => u.username === username.trim().toLowerCase() && u.password === password
  );
  if (!user) return { ok: false, message: 'Wrong username or password.' };
  if (user.role !== role) {
    return { ok: false, message: `This account is not a ${role} account.` };
  }
  const { password: _ignored, ...safeUser } = user;
  localStorage.setItem(KEY, JSON.stringify(safeUser));
  return { ok: true, user: safeUser };
}

export function logout() {
  localStorage.removeItem(KEY);
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}
// Role helpers – used to show or hide things for doctor / nurse
export function hasRole(...roles) {
  const user = getCurrentUser();
  return Boolean(user && roles.includes(user.role));
}

export const isDoctor = () => hasRole('doctor');
export const isNurse = () => hasRole('nurse');