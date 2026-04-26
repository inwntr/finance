import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import './Login.css'

export default function Login() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login', {
        login,
        password
      })

      localStorage.setItem('@finance:token', response.data.token)
      localStorage.setItem('@finance:user', JSON.stringify(response.data.user))

      navigate('/dashboard')
    } catch {
      setError('Login ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="auth-brand">
          <img src="/finance-icon.png" alt="Finance" />
          <span>My Finance</span>
        </div>

        <div className="auth-copy">
          <span className="auth-badge">Controle financeiro pessoal</span>
          <h1>Organize suas entradas, despesas e saldo em um só lugar.</h1>
          <p>
            Acompanhe sua vida financeira com uma dashboard simples,
            visual e segura.
          </p>
        </div>

        <div className="auth-preview-card">
          <span>Saldo atual</span>
          <strong>R$ 0,00</strong>
          <small>Resumo financeiro protegido por login.</small>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <h1>Entrar</h1>
          <p>Acesse sua conta financeira</p>

          <form onSubmit={handleSubmit}>
            <label>
              Username ou email
              <input
                type="text"
                placeholder="exemplo@email.com"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
              />
            </label>

            <label>
              Senha
              <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {error && <span className="auth-error">{error}</span>}

            <button type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <small>
            Não tem conta? <Link to="/register">Criar conta</Link>
          </small>
        </div>
      </section>
    </main>
  )
}