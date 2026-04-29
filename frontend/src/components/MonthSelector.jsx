import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MONTHS } from '../utils'

export default function MonthSelector({ month, year, onChange }) {
  const prev = () => {
    if (month === 1) onChange(12, year - 1)
    else onChange(month - 1, year)
  }
  const next = () => {
    if (month === 12) onChange(1, year + 1)
    else onChange(month + 1, year)
  }

  return (
    <div className="flex items-center gap-2">
      <button className="btn-icon" onClick={prev}><ChevronLeft size={16} /></button>
      <span style={{ fontWeight: 600, fontSize: '0.9rem', minWidth: 130, textAlign: 'center' }}>
        {MONTHS[month - 1]} {year}
      </span>
      <button className="btn-icon" onClick={next}><ChevronRight size={16} /></button>
    </div>
  )
}
