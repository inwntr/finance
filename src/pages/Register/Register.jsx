import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import '../Login/Login.css'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      await api.post('/auth/register', {
        username,
        email,
        password
      })

      navigate('/')
    } catch {
      setError('Erro ao criar conta')
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Criar conta</h1>
        <p>Comece a organizar suas finanças</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <span className="auth-error">{error}</span>}

          <button type="submit">Criar conta</button>
        </form>

        <small>
          Já tem conta? <Link to="/">Entrar</Link>
        </small>
      </section>
    </main>
  )
}