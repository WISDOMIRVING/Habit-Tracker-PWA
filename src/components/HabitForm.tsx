'use client';
import React, { useState } from 'react';
import { Habit } from '../types/habit';
import { validateHabitName } from '../lib/validators';

interface HabitFormProps {
  habit?: Habit;
  onSave: (name: string, description: string) => void;
  onCancel: () => void;
}

export const HabitForm: React.FC<HabitFormProps> = ({ habit, onSave, onCancel }) => {
  const [name, setName] = useState(habit?.name || '');
  const [description, setDescription] = useState(habit?.description || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateHabitName(name);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    onSave(validation.value, description);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      data-testid="habit-form"
      className="flex flex-col gap-4 p-4 border rounded bg-gray-50 w-full max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold">{habit ? 'Edit Habit' : 'Create New Habit'}</h2>
      <div className="flex flex-col gap-1">
        <label htmlFor="habit-name" className="text-sm font-medium">Habit Name</label>
        <input
          id="habit-name"
          data-testid="habit-name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="e.g. Drink Water"
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="habit-description" className="text-sm font-medium">Description</label>
        <textarea
          id="habit-description"
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
          placeholder="Optional description"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="habit-frequency" className="text-sm font-medium">Frequency</label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          disabled
          value="daily"
          className="border p-2 rounded bg-gray-100 cursor-not-allowed"
        >
          <option value="daily">Daily</option>
        </select>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          data-testid="habit-save-button"
          className="bg-blue-600 text-white p-2 rounded flex-1 font-bold hover:bg-blue-700 transition-colors"
        >
          Save Habit
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 p-2 rounded flex-1 font-bold hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
