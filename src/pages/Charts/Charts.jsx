import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { api } from '../../services/api'
import AppLayout from '../../components/Layout/AppLayout'
import './Charts.css'

const COLORS = ['#22c55e', '#ef4444', '#f59e0b']

export default function Charts() {
  const [data, setData] = useState([])

  useEffect(() => {
    async function loadChart() {
      const token = localStorage.getItem('@finance:token')

      const response = await api.get('/charts/financial-overview', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setData(response.data)
    }

    loadChart()
  }, [])

  return (
    <AppLayout>
      <main className="charts-page">
        <header className="charts-header">
          <h1>Gráficos</h1>
          <p>Visão geral das suas finanças</p>
        </header>

        <section className="chart-card">
          <ResponsiveContainer width="100%" height={360}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={130}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </main>
    </AppLayout>
  )
}