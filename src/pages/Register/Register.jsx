import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import './Register.css'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post('/auth/register', {
        username,
        email,
        password
      })

      navigate('/')
    } catch (error) {
      if (error.response?.status === 409) {
        setError('Esse e-mail ou username já está em uso.')
        return
      }

      setError('Erro ao criar conta')
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
          <h1>Criar conta</h1>
          <p>Comece a organizar suas finanças</p>

          <form onSubmit={handleSubmit}>
            <label>
              Username
              <input
                type="text"
                placeholder="seu username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              Senha
              <input
                type="password"
                placeholder="Crie sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {error && <span className="auth-error">{error}</span>}

            <button type="submit" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <small>
            Já tem conta? <Link to="/">Entrar</Link>
          </small>
        </div>
      </section>
    </main>
  )
}