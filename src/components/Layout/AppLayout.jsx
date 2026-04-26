import { NavLink, useNavigate } from 'react-router-dom'
import './AppLayout.css'

export default function AppLayout({ children }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('@finance:user'))
  const year = new Date().getFullYear()

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
            <h2 className="name">My Finance</h2>
          </div>

          <div className="sidebar-profile">
            <div className="avatar">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" />
              ) : (
                user?.username?.charAt(0).toUpperCase()
              )}
            </div>

            <small className="sidebar-user">@{user?.username}</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/charts">Gráficos</NavLink>
          <NavLink to="/settings">Configurações</NavLink>
        </nav>

        <div className="sidebar-summary">
          <span>Saldo atual</span>
          <strong>Ver no dashboard</strong>
          <small>Resumo financeiro</small>
        </div>

        <button className="logout-button" onClick={handleLogout}>Sair</button>

        <footer className="sidebar-footer">
          <img src="/haonicon.png" alt="Haon Technologies" className="footer-icon"/>
          <small>
            <a href="https://haontechnologies.com" target="_blank" rel="noreferrer">Haon Technologies</a> © {year} | <a href="https://haongroup.com" target="_blank" rel="noreferrer">Haon Group</a>. All rights reserved.
          </small>
        </footer>
      </aside>

      <section className="app-content">{children}</section>
    </main>
  )
}
