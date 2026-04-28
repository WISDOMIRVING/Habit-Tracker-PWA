import { User, Session } from '../types/auth';
import { Habit } from '../types/habit';

const USERS_KEY = 'habit-tracker-users';
const SESSION_KEY = 'habit-tracker-session';
const HABITS_KEY = 'habit-tracker-habits';

export const storage = {
  getUsers: (): User[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveUser: (user: User) => {
    const users = storage.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },
  getSession: (): Session | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(SESSION_KEY);
    const content = localStorage.getItem(SESSION_KEY);
    return content ? JSON.parse(content) : null;
  },
  saveSession: (session: Session) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },
  clearSession: () => {
    localStorage.removeItem(SESSION_KEY);
  },
  getHabits: (userId: string): Habit[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(HABITS_KEY);
    const habits: Habit[] = data ? JSON.parse(data) : [];
    return habits.filter(h => h.userId === userId);
  },
  saveHabit: (habit: Habit) => {
    const data = localStorage.getItem(HABITS_KEY);
    let habits: Habit[] = data ? JSON.parse(data) : [];
    const index = habits.findIndex(h => h.id === habit.id);
    if (index >= 0) {
      habits[index] = habit;
    } else {
      habits.push(habit);
    }
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  },
  deleteHabit: (id: string) => {
    const data = localStorage.getItem(HABITS_KEY);
    let habits: Habit[] = data ? JSON.parse(data) : [];
    habits = habits.filter(h => h.id !== id);
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  }
};
