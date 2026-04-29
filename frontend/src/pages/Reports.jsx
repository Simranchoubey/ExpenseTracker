import { useState, useEffect } from 'react'
import { getDashboard, getTransactionsByMonth } from '../api'
import { fmt, CATEGORIES, now, MONTHS } from '../utils'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '10px 14px', borderRadius: 8, fontSize: 13 }}>
      <p style={{ color: 'var(--text2)', marginBottom: 4 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.stroke || p.fill }}>{p.name}: {fmt(p.value)}</p>
      ))}
    </div>
  )
}

export default function Reports() {
  const [{ month, year }, setPeriod] = useState(now())
  const [dashboard, setDashboard] = useState(null)
  const [txs, setTxs] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async (m, y) => {
    setLoading(true)
    try {
      const [d, t] = await Promise.all([getDashboard(m, y), getTransactionsByMonth(m, y)])
      setDashboard(d.data)
      setTxs(t.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load(month, year) }, [month, year])

  const handleYear = (e) => {
    const y = parseInt(e.target.value)
    setPeriod(p => ({ ...p, year: y }))
    load(month, y)
  }

  const handleMonth = (e) => {
    const m = parseInt(e.target.value)
    setPeriod(p => ({ ...p, month: m }))
    load(m, year)
  }

  const catData = dashboard?.categoryBreakdown
    ? Object.entries(dashboard.categoryBreakdown).map(([name, value]) => ({
        name, value: Number(value), emoji: CATEGORIES[name]?.emoji || '💼'
      }))
    : []

  if (loading) return <div className="empty"><p>Loading reports...</p></div>

  if (!dashboard) return (
    <div className="empty">
      <div className="empty-icon">🔌</div>
      <p>Connect the Spring Boot backend to see reports</p>
    </div>
  )

  const savings = Number(dashboard.totalIncome) - Number(dashboard.totalExpense)
  const savingsPct = dashboard.totalIncome > 0
    ? ((savings / Number(dashboard.totalIncome)) * 100).toFixed(1)
    : 0

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Monthly financial summary and analysis</p>
        </div>
        <div className="flex gap-2">
          <select className="form-select" style={{ width: 140 }} value={month} onChange={handleMonth}>
            {MONTHS.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
          </select>
          <select className="form-select" style={{ width: 90 }} value={year} onChange={handleYear}>
            {[2023,2024,2025,2026].map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid-3 mb-4">
        <div className="card card-sm">
          <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Income</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--green)' }}>{fmt(dashboard.totalIncome)}</div>
        </div>
        <div className="card card-sm">
          <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Expenses</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--red)' }}>{fmt(dashboard.totalExpense)}</div>
        </div>
        <div className="card card-sm">
          <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Savings Rate</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--mono)', color: savings >= 0 ? 'var(--accent)' : 'var(--red)' }}>
            {savings >= 0 ? '+' : ''}{savingsPct}%
          </div>
        </div>
      </div>

      <div className="grid-2 mb-4">
        {/* Trend chart */}
        <div className="card">
          <h3 className="section-title" style={{ marginBottom: 16 }}>6-Month Trend</h3>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={dashboard.monthlyChart || []}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="income"  name="Income"  stroke="var(--green)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="expense" name="Expense" stroke="var(--red)"   strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category bar chart */}
        <div className="card">
          <h3 className="section-title" style={{ marginBottom: 16 }}>Spending by Category</h3>
          {catData.length === 0
            ? <div className="empty"><p>No expense data</p></div>
            : (
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={catData} layout="vertical" barSize={14}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text2)', fontSize: 12 }}
                    width={80} axisLine={false} tickLine={false} />
                  <Tooltip formatter={v => fmt(v)} />
                  <Bar dataKey="value" name="Spent" radius={[0,4,4,0]}
                    fill="var(--accent)" />
                </BarChart>
              </ResponsiveContainer>
            )
          }
        </div>
      </div>

      {/* Transaction table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <h3 className="section-title">All Transactions — {MONTHS[month-1]} {year}</h3>
        </div>
        {txs.length === 0
          ? <div className="empty"><p>No transactions this month</p></div>
          : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {txs.map(tx => (
                    <tr key={tx.id}>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{tx.date}</td>
                      <td style={{ color: 'var(--text)', fontWeight: 500 }}>{tx.title}</td>
                      <td><span className="cat-pill">{CATEGORIES[tx.category]?.emoji} {tx.category}</span></td>
                      <td>
                        <span className={`badge ${tx.type === 'INCOME' ? 'badge-income' : 'badge-expense'}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td style={{
                        textAlign: 'right', fontFamily: 'var(--mono)', fontWeight: 600,
                        color: tx.type === 'INCOME' ? 'var(--green)' : 'var(--red)'
                      }}>
                        {tx.type === 'INCOME' ? '+' : '-'}{fmt(tx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </div>
  )
}
