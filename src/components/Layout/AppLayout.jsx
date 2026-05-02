import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { api } from '../../services/api'
import './AppLayout.css'

export default function AppLayout({ children }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('@finance:user'))
  const year = new Date().getFullYear()
  const [apiStatus, setApiStatus] = useState(null)

  function handleLogout() {
    localStorage.removeItem('@finance:token')
    localStorage.removeItem('@finance:user')
    navigate('/')
  }

async function loadApiStatus() {
  try {
    const response = await api.get('/status')

    setApiStatus(response.data)
  } catch (error) {
    console.log('STATUS ERROR:', error)

    setApiStatus({
      status: 'outage',
      message: 'API unavailable',
      services: {
        api: 'outage',
        database: 'unknown'
      }
    })
  }
}

  useEffect(() => {
    loadApiStatus()

    const interval = setInterval(loadApiStatus, 60000)

    return () => clearInterval(interval)
  }, [])

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
          <NavLink to="/reports">Relatórios</NavLink>
          <NavLink to="/settings">Configurações</NavLink>
        </nav>

        <div className="sidebar-summary">
          <span>Saldo atual</span>
          <strong>Ver no dashboard</strong>
          <small>Resumo financeiro</small>
        </div>

        <div className="sidebar-widget desktop-only">
          <span>💸</span>
          <strong>My Finance</strong>
          <p>Organizando seu caos financeiro.</p>
        </div>

        <div className="sidebar-quote desktop-only">
          <p>“Dinheiro quieto também trabalha.”</p>
        </div>

        <div className="sidebar-decoration desktop-only">
          <div className="orb orb-one" />
          <div className="orb orb-two" />
        </div>

        <div className="sidebar-brand-card desktop-only">
          <img src="/finance-icon.png" alt="My Finance" className="sidebar-brand-logo" />
          <div>
            <strong>My Finance</strong>
            <p>organize. track. grow.</p>
          </div>
        </div>

        <div className="sidebar-about-card desktop-only">
          <span>✦</span>
          <p>Feito para transformar controle financeiro em clareza diária.</p>
        </div>

        <div className="sidebar-focus-card desktop-only">
          <small>foco do mês</small>
          <strong>consistência {'>'} perfeição</strong>
        </div>

        <div className="sidebar-founder-card desktop-only">
          <div className="sidebar-founder-avatar icon-avatar">✦</div>
          <div>
            <strong>Built by Aroe</strong>
            <p>indie maker building finance tools.</p>
          </div>
        </div>

        <div className="sidebar-status-card desktop-only">
          <div className="status-dot" />
          <span>Sync ativo</span>
        </div>

        <div className="sidebar-status-card desktop-only">
          <div className="status-dot" />
          <span>Cloud connected</span>
        </div>

        <div className={`sidebar-status-card desktop-only status-${apiStatus?.status || 'unknown'}`}>
          <div className="status-dot" />
          <div>
            <strong>
              {apiStatus?.status === 'online' && 'API online'}
              {apiStatus?.status === 'outage' && 'API outage'}
              {!apiStatus && 'Checking API'}
            </strong>

            <p> {apiStatus?.latencyMs ? `${apiStatus.latencyMs}ms latency` : 'Status service'} </p>
          </div>
        </div>

        <div className="sidebar-version desktop-only">
          v1.0.0 • My Finance
        </div>

        <button className="logout-button" onClick={handleLogout}>Sair</button>

        <footer className="sidebar-footer">
          <small>
            <a href="https://haontechnologies.netlify.app" target="_blank" rel="noreferrer">Haon Technologies</a> © {year} | <a href="https://haongroup.netlify.app" target="_blank" rel="noreferrer">Haon Group</a>. All rights reserved.
          </small>
        </footer>
      </aside>

      <section className="app-content">{children}</section>
    </main>
  )
}
