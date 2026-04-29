import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

// ── Transactions ──────────────────────────────────────────
export const getTransactions       = ()           => api.get('/transactions')
export const getTransactionsByMonth= (m, y)       => api.get(`/transactions/monthly?month=${m}&year=${y}`)
export const createTransaction     = (data)       => api.post('/transactions', data)
export const updateTransaction     = (id, data)   => api.put(`/transactions/${id}`, data)
export const deleteTransaction     = (id)         => api.delete(`/transactions/${id}`)

// ── Budgets ───────────────────────────────────────────────
export const getBudgets  = (m, y)   => api.get(`/budgets?month=${m}&year=${y}`)
export const saveBudget  = (data)   => api.post('/budgets', data)
export const deleteBudget= (id)     => api.delete(`/budgets/${id}`)

// ── Dashboard ─────────────────────────────────────────────
export const getDashboard= (m, y)   => api.get(`/dashboard?month=${m}&year=${y}`)

export default api
