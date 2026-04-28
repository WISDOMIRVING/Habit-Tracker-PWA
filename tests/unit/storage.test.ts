import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../../src/lib/storage';
import { User } from '../../src/types/auth';

describe('storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('saves and retrieves users', () => {
    const user: User = { id: '1', email: 't@t.com', password: '123', createdAt: '' };
    storage.saveUser(user);
    const users = storage.getUsers();
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe('t@t.com');
  });

  it('saves and retrieves sessions', () => {
    const session = { userId: '1', email: 't@t.com' };
    storage.saveSession(session);
    const retrieved = storage.getSession();
    expect(retrieved).toEqual(session);
  });

  it('clears sessions', () => {
    storage.saveSession({ userId: '1', email: 't@t.com' });
    storage.clearSession();
    expect(storage.getSession()).toBeNull();
  });

  it('saves and retrieves habits', () => {
    const habit: any = { id: 'h1', userId: 'u1', name: 'H', description: '', frequency: 'daily', createdAt: '', completions: [] };
    storage.saveHabit(habit);
    const habits = storage.getHabits('u1');
    expect(habits).toHaveLength(1);
    expect(habits[0].name).toBe('H');
  });

  it('deletes habits', () => {
    storage.saveHabit({ id: 'h1', userId: 'u1', name: 'H', description: '', frequency: 'daily', createdAt: '', completions: [] } as any);
    storage.deleteHabit('h1');
    expect(storage.getHabits('u1')).toHaveLength(0);
  });
});
