import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { CATEGORY_NAMES } from '../utils'
import toast from 'react-hot-toast'

const empty = {
  title: '', amount: '', type: 'EXPENSE',
  category: 'Food', date: new Date().toISOString().slice(0, 10), note: ''
}

export default function TransactionModal({ onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || empty)
  const [loading, setLoading] = useState(false)

  useEffect(() => { setForm(initial || empty) }, [initial])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!form.amount || parseFloat(form.amount) <= 0) {
      toast.error('Valid positive amount is required');
      return;
    }
    if (!form.date) {
      toast.error('Date is required');
      return;
    }
    
    setLoading(true)
    try {
      await onSave({ ...form, amount: parseFloat(form.amount) })
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{initial ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className="btn-icon" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Income / Expense toggle */}
        <div className="flex gap-2 mb-4">
          {['INCOME','EXPENSE'].map(t => (
            <button
              key={t}
              className="btn"
              onClick={() => set('type', t)}
              style={{
                flex: 1,
                background: form.type === t
                  ? (t === 'INCOME' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.15)')
                  : 'var(--surface2)',
                color: form.type === t
                  ? (t === 'INCOME' ? 'var(--green)' : 'var(--red)')
                  : 'var(--text2)',
                border: `1px solid ${form.type === t
                  ? (t === 'INCOME' ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.3)')
                  : 'var(--border)'}`,
              }}
            >
              {t === 'INCOME' ? '↑ Income' : '↓ Expense'}
            </button>
          ))}
        </div>

        <div className="form-group">
          <label className="form-label">Title</label>
          <input className="form-input" placeholder="e.g. Grocery shopping"
            value={form.title} onChange={e => set('title', e.target.value)} />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input className="form-input" type="number" min="0" placeholder="0.00"
              value={form.amount} onChange={e => set('amount', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input className="form-input" type="date"
              value={form.date} onChange={e => set('date', e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-select"
            value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORY_NAMES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Note (optional)</label>
          <input className="form-input" placeholder="Add a note..."
            value={form.note} onChange={e => set('note', e.target.value)} />
        </div>

        <div className="flex gap-2 mt-4">
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : (initial ? 'Update' : 'Add Transaction')}
          </button>
        </div>
      </div>
    </div>
  )
}
