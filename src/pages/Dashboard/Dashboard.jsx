import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import AppLayout from '../../components/Layout/AppLayout'
import './Dashboard.css'

export default function Dashboard() {
  const [incomeName, setIncomeName] = useState('')
  const [incomeValue, setIncomeValue] = useState('')
  const [feedback, setFeedback] = useState('')
  const [expenseName, setExpenseName] = useState('')
  const [expenseValue, setExpenseValue] = useState('')

  const [editingIncomeId, setEditingIncomeId] = useState(null)
  const [editingExpenseId, setEditingExpenseId] = useState(null)
  const [summary, setSummary] = useState(null)
  const [incomes, setIncomes] = useState([])
  const [expenses, setExpenses] = useState([])
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    type: null,
    id: null,
    message: ''
  })

  function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  async function loadData() {
    const token = localStorage.getItem('@finance:token')

    const headers = {
      Authorization: `Bearer ${token}`
    }

    const [summaryResponse, incomesResponse, expensesResponse] =
      await Promise.all([
        api.get('/dashboard/summary', { headers }),
        api.get('/incomes', { headers }),
        api.get('/expenses', { headers })
      ])

    setSummary(summaryResponse.data)
    setIncomes(incomesResponse.data)
    setExpenses(expensesResponse.data)
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!feedback) return

    const timer = setTimeout(() => {
      setFeedback('')
    }, 2500)

    return () => clearTimeout(timer)
  }, [feedback])

  if (!summary) {
    return (
      <AppLayout>
        <div className="loading-state">
          <div className="spinner" />
          <p>Carregando dados...</p>
        </div>
      </AppLayout>
    )
  }

  async function handleCreateIncome(event) {
    event.preventDefault()

    const token = localStorage.getItem('@finance:token')

    const payload = {
      name: incomeName,
      value: Number(incomeValue)
    }

    const headers = {
      Authorization: `Bearer ${token}`
    }

    if (editingIncomeId) {
      await api.patch(`/incomes/${editingIncomeId}`, payload, { headers })
      setFeedback('Entrada atualizada com sucesso.')
      setEditingIncomeId(null)
    } else {
      await api.post('/incomes', payload, { headers })
      setFeedback('Entrada criada com sucesso.')
    }

    setIncomeName('')
    setIncomeValue('')
    await loadData()
  }

  async function handleCreateExpense(event) {
    event.preventDefault()

    const token = localStorage.getItem('@finance:token')

    const payload = {
      name: expenseName,
      value: Number(expenseValue)
    }

    const headers = {
      Authorization: `Bearer ${token}`
    }

    if (editingExpenseId) {
      await api.patch(`/expenses/${editingExpenseId}`, payload, { headers })
      setFeedback('Despesa atualizada com sucesso.')
      setEditingExpenseId(null)
    } else {
      await api.post('/expenses', payload, { headers })
      setFeedback('Despesa criada com sucesso.')
    }

    setExpenseName('')
    setExpenseValue('')
    await loadData()
  }

  async function handlePayExpense(id) {
    const token = localStorage.getItem('@finance:token')

    await api.patch(`/expenses/${id}/pay`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    setFeedback('Ação realizada com sucesso.')
    await loadData()
  }

  async function handlePendingExpense(id) {
    const token = localStorage.getItem('@finance:token')

    await api.patch(`/expenses/${id}/pending`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    setFeedback('Ação realizada com sucesso.')
    await loadData()
  }

  function askDeleteIncome(id) {
    setDeleteModal({
      open: true,
      type: 'income',
      id,
      message: 'Deseja remover esta entrada?'
    })
  }

  function askDeleteExpense(id) {
    setDeleteModal({
      open: true,
      type: 'expense',
      id,
      message: 'Deseja remover esta despesa?'
    })
  }

  async function confirmDelete() {
    const token = localStorage.getItem('@finance:token')

    const headers = {
      Authorization: `Bearer ${token}`
    }

    if (deleteModal.type === 'income') {
      await api.delete(`/incomes/${deleteModal.id}`, { headers })
      setFeedback('Entrada removida com sucesso.')
    }

    if (deleteModal.type === 'expense') {
      await api.delete(`/expenses/${deleteModal.id}`, { headers })
      setFeedback('Despesa removida com sucesso.')
    }

    setDeleteModal({
      open: false,
      type: null,
      id: null,
      message: ''
    })

    await loadData()
  }

  function handleEditIncome(item) {
    setEditingIncomeId(item.id)
    setIncomeName(item.name)
    setIncomeValue(item.value)
  }

  function handleEditExpense(item) {
    setEditingExpenseId(item.id)
    setExpenseName(item.name)
    setExpenseValue(item.value)
  }

  function formatStatus(status) {
    return status === 'PAID' ? 'PAGO' : 'PENDENTE'
  }

  return (
    <AppLayout>
      <main className="dashboard-page">
        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Resumo financeiro da sua conta</p>
          </div>
        </header>

        {feedback && (
          <div className="feedback-message">
            {feedback}
          </div>
        )}

        <section className="summary-grid">
          <article className="summary-card">
            <span>Entradas</span>
            <strong>{formatCurrency(summary.totalIncomes)}</strong>
          </article>

          <article className="summary-card">
            <span>Saídas totais</span>
            <strong>{formatCurrency(summary.totalExpenses)}</strong>
          </article>

          <article className="summary-card">
            <span>Contas pagas</span>
            <strong>{formatCurrency(summary.totalPaidExpenses)}</strong>
          </article>

          <article className="summary-card">
            <span>Contas pendentes</span>
            <strong>{formatCurrency(summary.totalPendingExpenses)}</strong>
          </article>
        </section>

        <section className="balance-card-wrapper">
          <section
            className={
              summary.currentBalance > 0
                ? 'balance-card positive'
                : 'balance-card negative'
            }
          >
            <span>Saldo atual</span>
            <strong>{formatCurrency(summary.currentBalance)}</strong>

            {summary.alert && (
              <p>Atenção: seu saldo está zerado ou negativo.</p>
            )}
          </section>
        </section>

        <section className="forms-grid">
          <form className="quick-form" onSubmit={handleCreateIncome}>
            <h2>Nova entrada</h2>

            <input
              type="text"
              placeholder="Ex: Salário"
              value={incomeName}
              onChange={(e) => setIncomeName(e.target.value)}
            />

            <input
              type="number"
              placeholder="Valor"
              value={incomeValue}
              onChange={(e) => setIncomeValue(e.target.value)}
            />

            <button type="submit">Adicionar entrada</button>
          </form>

          <form className="quick-form" onSubmit={handleCreateExpense}>
            <h2>Nova despesa</h2>

            <input
              type="text"
              placeholder="Ex: Internet"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
            />

            <input
              type="number"
              placeholder="Valor"
              value={expenseValue}
              onChange={(e) => setExpenseValue(e.target.value)}
            />

            <button type="submit">Adicionar despesa</button>
          </form>
        </section>

        <section className="lists-grid">
          <article className={`list-card ${incomes.length > 0 ? 'has-items' : ''}`}>
            <h2>Entradas</h2>

            {incomes.length === 0 ? (
              <div className="empty-state">
                <span>📥</span>
                <p>Nenhuma entrada cadastrada.</p>
              </div>
            ) : (
              incomes.map((item) => (
                <div key={item.id} className="list-item">
                  <span>{item.name}</span>

                  <div className="expense-actions">
                    <strong>{formatCurrency(item.value)}</strong>
                    <button onClick={() => handleEditIncome(item)}>✏️</button>
                    <button onClick={() => askDeleteIncome(item.id)}>🗑️</button>
                  </div>
                </div>
              ))
            )}
          </article>

          <article className="list-card">
            <h2>Despesas</h2>

            {expenses.length === 0 ? (
              <div className="empty-state">
                <span>🧾</span>
                <p>Nenhuma despesa cadastrada.</p>
              </div>
            ) : (
              expenses.map((item) => (
                <div key={item.id} className="list-item">
                  <div>
                    <span>{item.name}</span>
                    <small>{formatStatus(item.status)}</small>
                  </div>

                  <div className="expense-actions">
                    <strong
                      className={item.status === 'PAID' ? 'status-paid' : 'status-pending'}
                    >
                      {formatCurrency(item.value)}
                    </strong>

                    <button onClick={() => handleEditExpense(item)}>✏️</button>
                    <button onClick={() => handlePendingExpense(item.id)}>❌</button>
                    <button onClick={() => handlePayExpense(item.id)}>✅</button>
                    <button onClick={() => askDeleteExpense(item.id)}>🗑️</button>
                  </div>
                </div>
              ))
            )}
          </article>
        </section>

        {deleteModal.open && (
          <div className="modal-overlay">
            <div className="confirm-modal">
              <h2>Confirmar remoção</h2>
              <p>{deleteModal.message}</p>

              <div className="confirm-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setDeleteModal({
                      open: false,
                      type: null,
                      id: null,
                      message: ''
                    })
                  }
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="delete-button"
                  onClick={confirmDelete}
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </AppLayout>
  )
}