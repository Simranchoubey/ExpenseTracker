import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ArrowUpDown, Target, FileBarChart } from 'lucide-react'

const links = [
  { path: '/',         label: 'Dashboard',    icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: ArrowUpDown   },
  { path: '/budget',   label: 'Budget',       icon: Target          },
  { path: '/reports',  label: 'Reports',      icon: FileBarChart    },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">💰</div>
        <div className="logo-text">Expense<span>IQ</span></div>
      </div>

      {links.map(({ path, label, icon: Icon }) => (
        <button
          key={path}
          className={`nav-link ${location.pathname === path ? 'active' : ''}`}
          onClick={() => navigate(path)}
        >
          <Icon size={18} />
          {label}
        </button>
      ))}
    </aside>
  )
}
