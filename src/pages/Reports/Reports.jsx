import { useEffect, useRef, useState } from 'react'
import { api } from '../../services/api'
import AppLayout from '../../components/Layout/AppLayout'
import './Reports.css'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function Reports() {
  const reportRef = useRef(null)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  const currentDate = new Date()
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())

  function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  async function loadReport(month = selectedMonth, year = selectedYear) {
    try {
      setLoading(true)

      const token = localStorage.getItem('@finance:token')

      const response = await api.get('/reports/monthly', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          month,
          year
        }
      })

      setReport(response.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReport(selectedMonth, selectedYear)
  }, [selectedMonth, selectedYear])

  async function handleExportPDF() {
    const element = reportRef.current
    if (!element) return

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#020617'
    })

    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    const imgWidth = pdfWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pdfHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight
    }

    pdf.save(
      `relatorio-my-finance-${String(selectedMonth).padStart(2, '0')}-${selectedYear}.pdf`
    )
  }

  if (loading || !report) {
    return (
      <AppLayout>
        <div className="loading-state">
          <div className="spinner" />
          <p>Carregando relatório...</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <main className="reports-page" ref={reportRef}>
        <header className="reports-header">
          <div>
            <h1>Relatórios</h1>
            <p>Resumo detalhado das movimentações do período.</p>
          </div>

          <button className="export-button" onClick={handleExportPDF}>
            Exportar PDF
          </button>
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

        <section className="summary-grid">
          <article className="summary-card">
            <span>Entradas</span>
            <strong>{formatCurrency(report.summary.totalIncomes)}</strong>
          </article>

          <article className="summary-card">
            <span>Despesas</span>
            <strong>{formatCurrency(report.summary.totalExpenses)}</strong>
          </article>

          <article className="summary-card">
            <span>Pagas</span>
            <strong>{formatCurrency(report.summary.totalPaidExpenses)}</strong>
          </article>

          <article className="summary-card">
            <span>Pendentes</span>
            <strong>{formatCurrency(report.summary.totalPendingExpenses)}</strong>
          </article>
        </section>

        <section className="balance-card-wrapper">
          <section
            className={
              report.summary.balance >= 0
                ? 'balance-card positive'
                : 'balance-card negative'
            }
          >
            <span>Saldo do período</span>
            <strong>{formatCurrency(report.summary.balance)}</strong>
          </section>
        </section>

        <section className="report-table-card">
          <div className="report-table-header">
            <h2>Entradas</h2>
          </div>

          {report.incomes.length === 0 ? (
            <div className="empty-state">
              <span>📥</span>
              <p>Nenhuma entrada no período.</p>
            </div>
          ) : (
            <table className="report-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {report.incomes.map((item) => (
                  <tr key={item.id}>
                    <td>{formatDate(item.date)}</td>
                    <td>{item.name}</td>
                    <td>{item.category || '—'}</td>
                    <td>{formatCurrency(item.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="report-table-card">
          <div className="report-table-header">
            <h2>Despesas</h2>
          </div>

          {report.expenses.length === 0 ? (
            <div className="empty-state">
              <span>🧾</span>
              <p>Nenhuma despesa no período.</p>
            </div>
          ) : (
            <table className="report-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Status</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {report.expenses.map((item) => (
                  <tr key={item.id}>
                    <td>{formatDate(item.date)}</td>
                    <td>{item.name}</td>
                    <td>{item.category || '—'}</td>
                    <td>{item.status === 'PAID' ? 'Pago' : 'Pendente'}</td>
                    <td>{formatCurrency(item.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </AppLayout>
  )
}