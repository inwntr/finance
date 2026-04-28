import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { api } from '../../services/api'
import AppLayout from '../../components/Layout/AppLayout'
import './Charts.css'

const OVERVIEW_COLORS = ['#22c55e', '#f59e0b', '#ef4444']
const CATEGORY_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#64748b']

export default function Charts() {
  const [overviewData, setOverviewData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [loading, setLoading] = useState(true)

  const currentDate = new Date()

  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())

  async function loadChart(month = selectedMonth, year = selectedYear) {
    try {
      setLoading(true)

      const token = localStorage.getItem('@finance:token')

      const response = await api.get('/charts/financial-overview', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          month,
          year
        }
      })

      setOverviewData(response.data.overview || [])
      setCategoryData(response.data.expensesByCategory || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChart(selectedMonth, selectedYear)
  }, [selectedMonth, selectedYear])

  const hasOverviewData = overviewData.some((item) => Number(item.value) > 0)
  const hasCategoryData = categoryData.some((item) => Number(item.value) > 0)

  return (
    <AppLayout>
      <main className="charts-page">
        <header className="charts-header">
          <h1>Gráficos</h1>
          <p>Visualize a distribuição geral das suas finanças.</p>
        </header>

        <section className="month-filter-card">
          <div>
            <span>Período</span>
            <strong>
              {String(selectedMonth).padStart(2, '0')}/{selectedYear}
            </strong>
          </div>

          <div className="month-filter-fields">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              <option value={1}>Janeiro</option>
              <option value={2}>Fevereiro</option>
              <option value={3}>Março</option>
              <option value={4}>Abril</option>
              <option value={5}>Maio</option>
              <option value={6}>Junho</option>
              <option value={7}>Julho</option>
              <option value={8}>Agosto</option>
              <option value={9}>Setembro</option>
              <option value={10}>Outubro</option>
              <option value={11}>Novembro</option>
              <option value={12}>Dezembro</option>
            </select>

            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              min="2020"
              max="2100"
            />
          </div>
        </section>

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
          ) : !hasOverviewData ? (
            <div className="chart-state">
              <span>📊</span>
              <p>Nenhum dado financeiro para exibir ainda.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={340}>
              <PieChart>
                <Pie
                  data={overviewData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={115}
                  innerRadius={65}
                  paddingAngle={3}
                >
                  {overviewData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={OVERVIEW_COLORS[index % OVERVIEW_COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="chart-card">
          <div className="chart-card-header">
            <div>
              <h2>Despesas por categoria</h2>
              <p>Veja onde seu dinheiro saiu no período selecionado.</p>
            </div>
          </div>

          {loading ? (
            <div className="chart-state">
              <div className="spinner" />
              <p>Carregando gráfico...</p>
            </div>
          ) : !hasCategoryData ? (
            <div className="chart-state">
              <span>🏷️</span>
              <p>Nenhuma despesa por categoria para exibir.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={340}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={115}
                  innerRadius={65}
                  paddingAngle={3}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    />
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