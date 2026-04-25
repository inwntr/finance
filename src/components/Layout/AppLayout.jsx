import { NavLink, useNavigate } from 'react-router-dom'
import './AppLayout.css'

export default function AppLayout({ children }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('@finance:user'))

  function handleLogout() {
    localStorage.removeItem('@finance:token')
    localStorage.removeItem('@finance:user')
    navigate('/')
  }

  return (
    <main className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="brand">
            <img src="/finance-icon.png" alt="Finance" className="brand-icon" />
            <h2 className='name'>Finance</h2>
          </div>

          <div className="sidebar-profile">
            <div className="avatar">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                />
              ) : (
                user?.username?.charAt(0).toUpperCase()
              )}
            </div>

            <small className="sidebar-user">@{user?.username}</small>
          </div>
        </div>

        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/charts">Gráficos</NavLink>
          <NavLink to="/settings">Configurações</NavLink>
        </nav>

        <div className="sidebar-summary">
          <span>Saldo atual</span>
          <strong>Ver no dashboard</strong>
          <small>Resumo financeiro</small>
        </div>

        <button onClick={handleLogout}>Sair</button>
      </aside>

      <section className="app-content">{children}</section>
    </main>
  )
}
