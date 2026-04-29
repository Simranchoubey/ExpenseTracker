import { useState, useEffect } from 'react'
import { getBudgets, saveBudget, deleteBudget } from '../api'
import { fmt, CATEGORIES, CATEGORY_NAMES, now, barColor } from '../utils'
import MonthSelector from '../components/MonthSelector'
import toast from 'react-hot-toast'
import { AlertTriangle, CheckCircle, Plus, Trash2 } from 'lucide-react'

export default function Budget() {
  const [{ month, year }, setPeriod] = useState(now())
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ category: 'Food', amount: '' })
  const [saving, setSaving] = useState(false)

  const load = async (m, y) => {
    setLoading(true)
    try {
      const res = await getBudgets(m, y)
      setBudgets(res.data)
    } catch { toast.error('Failed to load budgets') }
    setLoading(false)
  }

  useEffect(() => { load(month, year) }, [month, year])

  const changePeriod = (m, y) => { setPeriod({ month: m, year: y }); load(m, y) }

  const handleAdd = async () => {
    if (!form.amount || parseFloat(form.amount) <= 0) {
      toast.error('Enter a valid amount')
      return
    }
    setSaving(true)
    try {
      await saveBudget({ category: form.category, amount: parseFloat(form.amount), month, year })
      toast.success('Budget saved!')
      setForm(f => ({ ...f, amount: '' }))
      load(month, year)
    } catch { toast.error('Failed to save budget') }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    try {
      await deleteBudget(id)
      toast.success('Budget removed')
      load(month, year)
    } catch { toast.error('Failed to delete') }
  }

  // Overall budget summary
  const totalBudget  = budgets.reduce((s, b) => s + Number(b.amount), 0)
  const totalSpent   = budgets.reduce((s, b) => s + Number(b.spent  || 0), 0)
  const totalLeft    = totalBudget - totalSpent
  const overallPct   = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
  const isOverall    = overallPct >= 100

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Budget Planner</h1>
          <p className="page-subtitle">Set limits and track your spending per category</p>
        </div>
        <MonthSelector month={month} year={year} onChange={changePeriod} />
      </div>

      {/* Overall alert banner */}
      {budgets.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 18px', borderRadius: 12, marginBottom: 20,
          background: isOverall ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.08)',
          border: `1px solid ${isOverall ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.2)'}`,
        }}>
          {isOverall
            ? <AlertTriangle size={20} color="var(--red)" />
            : <CheckCircle   size={20} color="var(--green)" />
          }
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: '0.9rem',
              color: isOverall ? 'var(--red)' : 'var(--green)' }}>
              {isOverall ? '⚠️ Overall budget exceeded!' : '✅ Within overall budget'}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>
              Spent {fmt(totalSpent)} of {fmt(totalBudget)} total budget · {fmt(Math.abs(totalLeft))} {totalLeft >= 0 ? 'remaining' : 'overspent'}
            </p>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 700,
            color: isOverall ? 'var(--red)' : 'var(--green)', fontSize: '1.1rem' }}>
            {Math.round(overallPct)}%
          </div>
        </div>
      )}

      <div className="grid-2">
        {/* Add budget form */}
        <div className="card" style={{ alignSelf: 'start' }}>
          <h3 className="section-title" style={{ marginBottom: 16 }}>Set Category Budget</h3>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORY_NAMES.map(c => (
                <option key={c}>{CATEGORIES[c].emoji} {c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Monthly Budget (₹)</label>
            <input className="form-input" type="number" min="0" placeholder="e.g. 3000"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleAdd()} />
          </div>

          <button className="btn btn-primary" style={{ width: '100%' }}
            onClick={handleAdd} disabled={saving}>
            <Plus size={16} /> {saving ? 'Saving...' : 'Set Budget'}
          </button>

          <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 12, lineHeight: 1.5 }}>
            💡 Tip: Setting a budget for a category that already has one will update it.
          </p>
        </div>

        {/* Budget list */}
        <div>
          {loading && <div className="empty"><p>Loading budgets...</p></div>}
          {!loading && budgets.length === 0 && (
            <div className="card empty">
              <div className="empty-icon">🎯</div>
              <p>No budgets set for this month.</p>
              <p style={{ marginTop: 6 }}>Add your first budget →</p>
            </div>
          )}
          {budgets.map(b => {
            const spent = Number(b.spent || 0)
            const pct = b.amount > 0 ? Math.min(110, (spent / Number(b.amount)) * 100) : 0
            const over = pct >= 100
            const warn = pct >= 80 && !over
            const cat = CATEGORIES[b.category] || CATEGORIES['Other']

            return (
              <div key={b.id} className="card card-sm" style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      {cat.emoji} {b.category}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 2 }}>
                      {fmt(spent)} spent of {fmt(b.amount)} budget
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {over && <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 99, background: 'rgba(239,68,68,0.15)', color: 'var(--red)', fontWeight: 600 }}>OVER</span>}
                    {warn && <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 99, background: 'rgba(245,158,11,0.15)', color: 'var(--yellow)', fontWeight: 600 }}>⚠ 80%</span>}
                    <span style={{ fontFamily: 'var(--mono)', fontWeight: 700,
                      color: over ? 'var(--red)' : warn ? 'var(--yellow)' : 'var(--green)',
                      fontSize: '0.9rem' }}>
                      {Math.round(pct)}%
                    </span>
                    <button className="btn-icon danger" onClick={() => handleDelete(b.id)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="budget-bar-wrap">
                  <div className="budget-bar"
                    style={{ width: `${pct}%`, background: barColor(pct) }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6,
                  fontSize: '0.75rem', color: 'var(--text3)' }}>
                  <span>₹0</span>
                  <span style={{ color: over ? 'var(--red)' : 'var(--text3)', fontWeight: over ? 600 : 400 }}>
                    {over
                      ? `Overspent by ${fmt(spent - Number(b.amount))}`
                      : `${fmt(Number(b.amount) - spent)} remaining`}
                  </span>
                  <span>{fmt(b.amount)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
