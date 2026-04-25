import { Link } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  return (
    <main className="not-found-page">
      <section className="not-found-card">
        <h1>404</h1>
        <p>Página não encontrada.</p>
        <Link to="/dashboard">Voltar ao dashboard</Link>
      </section>
    </main>
  )
}