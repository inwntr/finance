import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { api } from '../../services/api'
import AppLayout from '../../components/Layout/AppLayout'
import './Charts.css'

const COLORS = ['#22c55e', '#f59e0b', '#ef4444']

export default function Charts() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadChart() {
      try {
        const token = localStorage.getItem('@finance:token')

        const response = await api.get('/charts/financial-overview', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        setData(response.data)
      } finally {
        setLoading(false)
      }
    }

    loadChart()
  }, [])

  const hasData = data.some((item) => Number(item.value) > 0)

  return (
    <AppLayout>
      <main className="charts-page">
        <header className="charts-header">
          <h1>Gráficos</h1>
          <p>Visualize a distribuição geral das suas finanças.</p>
        </header>

        <section className="chart-card">
          <div className="chart-card-header">
            <div>
              <h2>Resumo financeiro</h2>
              <p>Entradas, despesas pagas e despesas pendentes.</p>
            </div>
          </div>

          {loading ? (
            <div className="chart-state">
              <div className="spinner" />
              <p>Carregando gráfico...</p>
            </div>
          ) : !hasData ? (
            <div className="chart-state">
              <span>📊</span>
              <p>Nenhum dado financeiro para exibir ainda.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={340}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={115}
                  innerRadius={65}
                  paddingAngle={3}
                >
                  {data.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </section>
      </main>
    </AppLayout>
  )
}