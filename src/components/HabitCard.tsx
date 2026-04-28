'use client';
import React from 'react';
import { Habit } from '../types/habit';
import { getHabitSlug } from '../lib/slug';
import { calculateCurrentStreak } from '../lib/streaks';

interface HabitCardProps {
  habit: Habit;
  onToggle: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, onEdit, onDelete }) => {
  const slug = getHabitSlug(habit.name);
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions, today);

  return (
    <div 
      data-testid={`habit-card-${slug}`}
      className="border p-4 rounded-xl shadow-sm flex flex-col gap-2 bg-white hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold truncate">{habit.name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{habit.description}</p>
        </div>
        <div 
          data-testid={`habit-streak-${slug}`}
          className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap ml-2"
        >
          🔥 {streak}
        </div>
      </div>
      
      <div className="flex items-center gap-4 mt-4">
        <button
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggle(habit)}
          className={`flex-1 p-3 rounded-lg border transition-all ${
            isCompletedToday 
              ? 'bg-green-600 border-green-600 text-white font-bold' 
              : 'bg-white border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600'
          }`}
        >
          {isCompletedToday ? 'Completed ✓' : 'Mark Complete'}
        </button>
        
        <div className="flex gap-1">
          <button
            data-testid={`habit-edit-${slug}`}
            onClick={() => onEdit(habit)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            ✏️
          </button>
          <button
            data-testid={`habit-delete-${slug}`}
            onClick={() => onDelete(habit.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};
