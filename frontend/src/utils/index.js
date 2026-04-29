// Format number as Indian Rupee
export const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0)

// Category config — emoji + color per category
export const CATEGORIES = {
  Food:       { emoji: '🍔', color: '#f59e0b' },
  Travel:     { emoji: '✈️',  color: '#6c63ff' },
  Shopping:   { emoji: '🛍️', color: '#ec4899' },
  Rent:       { emoji: '🏠', color: '#3b82f6' },
  Bills:      { emoji: '⚡', color: '#f97316' },
  Education:  { emoji: '📚', color: '#22c55e' },
  Health:     { emoji: '💊', color: '#ef4444' },
  Other:      { emoji: '💼', color: '#8891aa' },
}

export const CATEGORY_NAMES = Object.keys(CATEGORIES)

// Month names
export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

export const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// Get current month/year
export const now = () => {
  const d = new Date()
  return { month: d.getMonth() + 1, year: d.getFullYear() }
}

// Budget bar color
export const barColor = (pct) => {
  if (pct >= 100) return '#ef4444'
  if (pct >= 80)  return '#f59e0b'
  return '#22c55e'
}
