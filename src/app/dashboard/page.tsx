'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';
import { Habit } from '@/types/habit';
import { Session } from '@/types/auth';
import { HabitCard } from '@/components/HabitCard';
import { HabitForm } from '@/components/HabitForm';
import { toggleHabitCompletion } from '@/lib/habits';

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentSession = storage.getSession();
    if (!currentSession) {
      router.push('/login');
    } else {
      setSession(currentSession);
      setHabits(storage.getHabits(currentSession.userId));
    }
  }, [router]);

  const handleLogout = () => {
    storage.clearSession();
    router.push('/login');
  };

  const handleSaveHabit = (name: string, description: string) => {
    if (!session) return;

    if (editingHabit) {
      const updatedHabit: Habit = {
        ...editingHabit,
        name,
        description
      };
      storage.saveHabit(updatedHabit);
      setEditingHabit(null);
    } else {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        userId: session.userId,
        name,
        description,
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: []
      };
      storage.saveHabit(newHabit);
      setIsAdding(false);
    }
    setHabits(storage.getHabits(session.userId));
  };

  const handleToggleHabit = (habit: Habit) => {
    if (!session) return;
    const today = new Date().toISOString().split('T')[0];
    const updatedHabit = toggleHabitCompletion(habit, today);
    storage.saveHabit(updatedHabit);
    setHabits(storage.getHabits(session.userId));
  };

  if (!mounted || !session) return null;

  return (
    <main data-testid="dashboard-page" className="min-h-screen p-4 bg-gray-50 pb-20">
      <header className="flex justify-between items-center mb-8 max-w-2xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold">My Habits</h1>
          <p className="text-sm text-gray-500">{session.email}</p>
        </div>
        <button
          data-testid="auth-logout-button"
          onClick={handleLogout}
          className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors"
        >
          Logout
        </button>
      </header>

      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        {!isAdding && !editingHabit && (
          <button
            data-testid="create-habit-button"
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white p-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all transform hover:scale-[1.02]"
          >
            + Create New Habit
          </button>
        )}

        {(isAdding || editingHabit) && (
          <HabitForm
            habit={editingHabit || undefined}
            onSave={handleSaveHabit}
            onCancel={() => {
              setIsAdding(false);
              setEditingHabit(null);
            }}
          />
        )}

        {habits.length === 0 ? (
          <div 
            data-testid="empty-state"
            className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200"
          >
            <div className="text-4xl mb-4">✨</div>
            <p className="text-gray-500 font-medium">No habits yet. Start by creating one!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={handleToggleHabit}
                onEdit={setEditingHabit}
                onDelete={setHabitToDelete}
              />
            ))}
          </div>
        )}
      </div>

      {habitToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl max-w-sm w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Delete Habit?</h2>
            <p className="mb-8 text-gray-600">This action cannot be undone. Are you sure you want to remove this habit?</p>
            <div className="flex gap-4">
              <button
                data-testid="confirm-delete-button"
                onClick={() => {
                  storage.deleteHabit(habitToDelete);
                  setHabitToDelete(null);
                  setHabits(storage.getHabits(session.userId));
                }}
                className="bg-red-600 text-white p-3 rounded-xl flex-1 font-bold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setHabitToDelete(null)}
                className="bg-gray-100 text-gray-700 p-3 rounded-xl flex-1 font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
