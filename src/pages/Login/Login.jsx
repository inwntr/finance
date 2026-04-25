import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import './Login.css'

export default function Login() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

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
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Entrar</h1>
        <p>Acesse sua conta financeira</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username ou email"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <span className="auth-error">{error}</span>}

          <button type="submit">Entrar</button>
        </form>

        <small>
          Não tem conta? <Link to="/register">Criar conta</Link>
        </small>
      </section>
    </main>
  )
}