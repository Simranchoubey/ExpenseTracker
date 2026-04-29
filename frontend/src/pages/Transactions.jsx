import { useState, useEffect } from 'react'
import { getTransactionsByMonth, createTransaction, updateTransaction, deleteTransaction } from '../api'
import { fmt, CATEGORIES, now } from '../utils'
import MonthSelector from '../components/MonthSelector'
import TransactionModal from '../components/TransactionModal'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function Transactions() {
  const [{ month, year }, setPeriod] = useState(now())
  const [txs, setTxs] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'add' | {tx}
  const [filter, setFilter] = useState('ALL') // ALL | INCOME | EXPENSE

  const load = async (m, y) => {
    setLoading(true)
    try {
      const res = await getTransactionsByMonth(m, y)
      setTxs(res.data)
    } catch { toast.error('Failed to load transactions') }
    setLoading(false)
  }

  useEffect(() => { load(month, year) }, [month, year])

  const changePeriod = (m, y) => { setPeriod({ month: m, year: y }); load(m, y) }

  const handleSave = async (data) => {
    try {
      if (modal?.id) {
        await updateTransaction(modal.id, data)
        toast.success('Transaction updated!')
      } else {
        await createTransaction(data)
        toast.success('Transaction added!')
      }
      setModal(null)
      load(month, year)
    } catch { toast.error('Something went wrong') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return
    try {
      await deleteTransaction(id)
      toast.success('Deleted!')
      load(month, year)
    } catch { toast.error('Failed to delete') }
  }

  const filtered = txs.filter(t => filter === 'ALL' || t.type === filter)

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">All your income and expenses</p>
        </div>
        <div className="flex gap-2 items-center">
          <MonthSelector month={month} year={year} onChange={changePeriod} />
          <button className="btn btn-primary" onClick={() => setModal('add')}>
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {['ALL','INCOME','EXPENSE'].map(f => (
          <button key={f} className="btn btn-sm"
            onClick={() => setFilter(f)}
            style={{
              background: filter === f ? 'var(--accent)' : 'var(--surface2)',
              color: filter === f ? '#fff' : 'var(--text2)',
              border: '1px solid ' + (filter === f ? 'var(--accent)' : 'var(--border)')
            }}>
            {f === 'ALL' ? 'All' : f === 'INCOME' ? '↑ Income' : '↓ Expense'}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text3)', alignSelf: 'center' }}>
          {filtered.length} transactions
        </span>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div className="empty"><p>Loading...</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📭</div>
            <p>No transactions found</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(tx => {
                  const cat = CATEGORIES[tx.category] || CATEGORIES['Other']
                  return (
                    <tr key={tx.id}>
                      <td>
                        <div style={{ fontWeight: 500, color: 'var(--text)' }}>{tx.title}</div>
                        {tx.note && <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{tx.note}</div>}
                      </td>
                      <td>
                        <span className="cat-pill">{cat.emoji} {tx.category}</span>
                      </td>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{tx.date}</td>
                      <td>
                        <span className={`badge ${tx.type === 'INCOME' ? 'badge-income' : 'badge-expense'}`}>
                          {tx.type === 'INCOME' ? '↑ Income' : '↓ Expense'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontWeight: 600,
                        color: tx.type === 'INCOME' ? 'var(--green)' : 'var(--red)' }}>
                        {tx.type === 'INCOME' ? '+' : '-'}{fmt(tx.amount)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="flex gap-2 justify-end">
                          <button className="btn-icon" onClick={() => setModal({
                            ...tx, amount: String(tx.amount),
                            date: tx.date
                          })}>
                            <Pencil size={13} />
                          </button>
                          <button className="btn-icon danger" onClick={() => handleDelete(tx.id)}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <TransactionModal
          onClose={() => setModal(null)}
          onSave={handleSave}
          initial={modal === 'add' ? null : modal}
        />
      )}
    </div>
  )
}
