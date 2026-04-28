export function calculateCurrentStreak(completions: string[], today?: string): number {
  if (!completions.length) return 0;

  const uniqueCompletions = Array.from(new Set(completions)).sort().reverse();
  const todayStr = today || new Date().toISOString().split('T')[0];

  if (!uniqueCompletions.includes(todayStr)) return 0;

  let streak = 0;
  let currentDate = new Date(todayStr);

  // We need to iterate through the uniqueCompletions and check if they are consecutive
  // But uniqueCompletions might contain dates in the future or very old dates.
  // The rule is: count consecutive calendar days backwards from today.

  let checkDate = new Date(todayStr);
  
  while (true) {
    const checkDateStr = checkDate.toISOString().split('T')[0];
    if (uniqueCompletions.includes(checkDateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
