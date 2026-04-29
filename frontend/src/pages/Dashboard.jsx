import { useState, useEffect } from 'react'
import { getDashboard, createTransaction } from '../api'
import { fmt, CATEGORIES, now, barColor } from '../utils'
import MonthSelector from '../components/MonthSelector'
import TransactionModal from '../components/TransactionModal'
import toast from 'react-hot-toast'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend
} from 'recharts'
import { TrendingUp, TrendingDown, Wallet, Plus } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '10px 14px', borderRadius: 8, fontSize: 13 }}>
      <p style={{ color: 'var(--text2)', marginBottom: 4 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.fill || p.stroke }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [{ month, year }, setPeriod] = useState(now())
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const load = async (m, y) => {
    setLoading(true)
    try {
      const res = await getDashboard(m, y)
      setData(res.data)
    } catch { /* backend not connected yet */ }
    setLoading(false)
  }

  useEffect(() => { load(month, year) }, [month, year])

  const changePeriod = (m, y) => { setPeriod({ month: m, year: y }); load(m, y) }

  const handleSaveTransaction = async (txData) => {
    try {
      await createTransaction(txData)
      toast.success('Transaction added successfully!')
      setModalOpen(false)
      load(month, year) // Instantly refresh dashboard data
    } catch (e) {
      toast.error('Failed to add transaction')
      throw e
    }
  }

  const pieData = data?.categoryBreakdown
    ? Object.entries(data.categoryBreakdown).map(([name, value]) => ({ name, value: Number(value) }))
    : []

  const COLORS = Object.values(CATEGORIES).map(c => c.color)

  if (loading) return (
    <div className="empty"><div className="empty-icon">⏳</div><p>Loading dashboard...</p></div>
  )

  if (!data) return (
    <div className="empty">
      <div className="empty-icon">🔌</div>
      <p>Backend not connected. Start your Spring Boot server!</p>
    </div>
  )

  return (
    <div>
      <div className="page-header flex justify-between items-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Your financial overview at a glance</p>
        </div>
        <div className="flex gap-2 items-center">
          <MonthSelector month={month} year={year} onChange={changePeriod} />
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Add 
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        <div className="stat-card income">
          <div className="stat-label"><TrendingUp size={14} /> Total Income</div>
          <div className="stat-value income">{fmt(data.totalIncome)}</div>
        </div>
        <div className="stat-card expense">
          <div className="stat-label"><TrendingDown size={14} /> Total Expenses</div>
          <div className="stat-value expense">{fmt(data.totalExpense)}</div>
        </div>
        <div className="stat-card balance">
          <div className="stat-label"><Wallet size={14} /> Balance</div>
          <div className={`stat-value ${Number(data.balance) >= 0 ? 'balance' : 'expense'}`}>
            {fmt(data.balance)}
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid-2 mb-4">
        {/* Monthly bar chart */}
        <div className="card">
          <div className="section-header"><h3 className="section-title">Monthly Overview</h3></div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.monthlyChart || []} barGap={4}>
              <XAxis dataKey="label" tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income"  name="Income"  fill="var(--green)" radius={[4,4,0,0]} />
              <Bar dataKey="expense" name="Expense" fill="var(--red)"   radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="card">
          <div className="section-header"><h3 className="section-title">By Category</h3></div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="45%" cy="50%" innerRadius={55} outerRadius={85}
                  dataKey="value" nameKey="name" paddingAngle={3}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => fmt(v)} />
                <Legend iconType="circle" iconSize={8}
                  formatter={(v) => <span style={{ fontSize: 12, color: 'var(--text2)' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty"><p>No expense data this month</p></div>
          )}
        </div>
      </div>

      {/* Category breakdown + recent transactions */}
      <div className="grid-2">
        {/* Category breakdown */}
        <div className="card">
          <div className="section-header"><h3 className="section-title">Category Breakdown</h3></div>
          {pieData.length === 0 && <div className="empty"><p>No expenses yet</p></div>}
          {pieData.map(({ name, value }) => {
            const pct = data.totalExpense > 0 ? Math.min(100, (value / Number(data.totalExpense)) * 100) : 0
            const cat = CATEGORIES[name] || CATEGORIES['Other']
            return (
              <div key={name} style={{ marginBottom: 14 }}>
                <div className="flex justify-between items-center">
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{cat.emoji} {name}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '0.85rem', color: 'var(--text2)' }}>{fmt(value)}</span>
                </div>
                <div className="budget-bar-wrap">
                  <div className="budget-bar" style={{ width: `${pct}%`, background: cat.color }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Recent transactions */}
        <div className="card">
          <div className="section-header"><h3 className="section-title">Recent Transactions</h3></div>
          {(!data.recentTransactions || data.recentTransactions.length === 0) && (
            <div className="empty"><p>No transactions this month</p></div>
          )}
          {(data.recentTransactions || []).map(tx => (
            <div key={tx.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: '1px solid var(--border)'
            }}>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{tx.title}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>
                  {CATEGORIES[tx.category]?.emoji} {tx.category} · {tx.date}
                </p>
              </div>
              <span style={{
                fontFamily: 'var(--mono)', fontWeight: 600,
                color: tx.type === 'INCOME' ? 'var(--green)' : 'var(--red)'
              }}>
                {tx.type === 'INCOME' ? '+' : '-'}{fmt(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <TransactionModal
          onClose={() => setModalOpen(false)}
          onSave={handleSaveTransaction}
        />
      )}
    </div>
  )
}
