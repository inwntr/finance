import { useEffect, useRef, useState } from 'react'
import { api } from '../../services/api'
import AppLayout from '../../components/Layout/AppLayout'
import './Dashboard.css'

export default function Dashboard() {
  const [incomeName, setIncomeName] = useState('')
  const [incomeValue, setIncomeValue] = useState('')
  const [feedback, setFeedback] = useState('')
  const [expenseName, setExpenseName] = useState('')
  const [expenseValue, setExpenseValue] = useState('')
  const [incomeDate, setIncomeDate] = useState('')
  const [expenseDate, setExpenseDate] = useState('')
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

  const [editingGoalId, setEditingGoalId] = useState(null)
  const currentDate = new Date()
  const menuRef = useRef(null)
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())
  const [incomeCategory, setIncomeCategory] = useState('')
  const [expenseCategory, setExpenseCategory] = useState('')
  const [openMenuId, setOpenMenuId] = useState(null)
  const [expenseIsRecurring, setExpenseIsRecurring] = useState(false)
  const [expenseRecurrenceDay, setExpenseRecurrenceDay] = useState('')

  const [budget, setBudget] = useState(null)
  const [budgetAmount, setBudgetAmount] = useState('')
  const [goals, setGoals] = useState([])

  const [goalName, setGoalName] = useState('')
  const [goalTargetAmount, setGoalTargetAmount] = useState('')
  const [goalCurrentAmount, setGoalCurrentAmount] = useState('')
  const [goalDeadline, setGoalDeadline] = useState('')
  const [insights, setInsights] = useState([])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  async function loadData(month = selectedMonth, year = selectedYear) {
    const token = localStorage.getItem('@finance:token')

    const headers = {
      Authorization: `Bearer ${token}`
    }

    const params = {
      month,
      year
    }

    const [summaryResponse, incomesResponse, expensesResponse] =
      await Promise.all([
        api.get('/dashboard/summary', { headers, params }),
        api.get('/incomes', { headers, params }),
        api.get('/expenses', { headers, params })
      ])

    setSummary(summaryResponse.data)
    setIncomes(incomesResponse.data)
    setExpenses(expensesResponse.data)
  }

  async function loadBudget(month = selectedMonth, year = selectedYear) {
    const token = localStorage.getItem('@finance:token')

    const response = await api.get('/budgets', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        month,
        year
      }
    })

    setBudget(response.data)
    setBudgetAmount(response.data?.amount || '')
  }

  async function loadGoals() {
    const token = localStorage.getItem('@finance:token')

    const response = await api.get('/goals', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    setGoals(response.data)
  }

  useEffect(() => {
    loadData(selectedMonth, selectedYear)
    loadBudget(selectedMonth, selectedYear)
    loadGoals()
    loadInsights(selectedMonth, selectedYear)
  }, [selectedMonth, selectedYear])

  useEffect(() => {
    if (!feedback) return

    const timer = setTimeout(() => {
      setFeedback('')
    }, 2500)

    return () => clearTimeout(timer)
  }, [feedback])

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

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
      value: Number(incomeValue),
      date: incomeDate || `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`,
      category: incomeCategory
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
    setIncomeDate('')
    setIncomeCategory('')
    await loadData()
  }

  async function handleCreateExpense(event) {
    event.preventDefault()

    const token = localStorage.getItem('@finance:token')

    const payload = {
      name: expenseName,
      value: Number(expenseValue),
      date: expenseDate || `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`,
      category: expenseCategory,
      isRecurring: expenseIsRecurring,
      recurrenceDay: expenseIsRecurring ? Number(expenseRecurrenceDay) : null
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
    setExpenseDate('')
    setExpenseCategory('')
    setExpenseIsRecurring(false)
    setExpenseRecurrenceDay('')
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
      await loadData()
    }

    if (deleteModal.type === 'expense') {
      await api.delete(`/expenses/${deleteModal.id}`, { headers })
      setFeedback('Despesa removida com sucesso.')
      await loadData()
    }

    if (deleteModal.type === 'goal') {
      await api.delete(`/goals/${deleteModal.id}`, { headers })
      setFeedback('Meta removida com sucesso.')
      await loadGoals()
    }

    if (deleteModal.type === 'budget') {
      await api.delete('/budgets', {
        headers,
        params: {
          month: selectedMonth,
          year: selectedYear
        }
      })

      setBudget(null)
      setBudgetAmount('')
      setFeedback('Orçamento removido com sucesso.')
    }

    setDeleteModal({
      open: false,
      type: null,
      id: null,
      message: ''
    })

    await loadInsights(selectedMonth, selectedYear)
  }

  function handleEditIncome(item) {
    setEditingIncomeId(item.id)
    setIncomeName(item.name)
    setIncomeValue(item.value)
    setIncomeDate(formatDateInput(item.date))
    setIncomeCategory(item.category || '')
  }

  function handleEditExpense(item) {
    setEditingExpenseId(item.id)
    setExpenseName(item.name)
    setExpenseValue(item.value)
    setExpenseDate(formatDateInput(item.date))
    setExpenseCategory(item.category || '')
    setExpenseIsRecurring(Boolean(item.isRecurring))
    setExpenseRecurrenceDay(item.recurrenceDay || '')
  }

  function formatStatus(status) {
    return status === 'PAID' ? 'PAGO' : 'PENDENTE'
  }

  function formatDateInput(date) {
    if (!date) return ''

    const localDate = new Date(date)
    const year = localDate.getFullYear()
    const month = String(localDate.getMonth() + 1).padStart(2, '0')
    const day = String(localDate.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  async function handleSaveBudget(e) {
    e.preventDefault()

    const token = localStorage.getItem('@finance:token')

    await api.post(
      '/budgets',
      {
        month: selectedMonth,
        year: selectedYear,
        amount: Number(budgetAmount)
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    setFeedback('Orçamento salvo com sucesso.')
    await loadBudget(selectedMonth, selectedYear)
  }

  async function handleCreateGoal(e) {
    e.preventDefault()

    const token = localStorage.getItem('@finance:token')

    const payload = {
      name: goalName,
      targetAmount: Number(goalTargetAmount),
      currentAmount: Number(goalCurrentAmount || 0),
      deadline: goalDeadline || null
    }

    if (editingGoalId) {
      await api.put(`/goals/${editingGoalId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setFeedback('Meta atualizada com sucesso.')
      setEditingGoalId(null)
    } else {
      await api.post('/goals', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setFeedback('Meta criada com sucesso.')
    }

    setGoalName('')
    setGoalTargetAmount('')
    setGoalCurrentAmount('')
    setGoalDeadline('')

    await loadGoals()
  }

  const budgetUsed = budget?.amount
    ? (summary.totalExpenses / budget.amount) * 100
    : 0

  const budgetRemaining = budget?.amount
    ? budget.amount - summary.totalExpenses
    : 0

  function handleEditGoal(goal) {
    setEditingGoalId(goal.id)
    setGoalName(goal.name)
    setGoalTargetAmount(goal.targetAmount)
    setGoalCurrentAmount(goal.currentAmount)
    setGoalDeadline(goal.deadline ? formatDateInput(goal.deadline) : '')
  }

  async function loadInsights(month = selectedMonth, year = selectedYear) {
    const token = localStorage.getItem('@finance:token')

    const response = await api.get('/insights', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        month,
        year
      }
    })

    setInsights(response.data)
  }

  const filteredIncomes = incomes.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesType = filterType === 'all' || filterType === 'income'

    const matchesCategory =
      !filterCategory || item.category === filterCategory

    return matchesSearch && matchesType && matchesCategory
  })

  const filteredExpenses = expenses.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesType = filterType === 'all' || filterType === 'expense'

    const matchesCategory =
      !filterCategory || item.category === filterCategory

    const matchesStatus =
      filterStatus === 'all' || item.status === filterStatus

    return matchesSearch && matchesType && matchesCategory && matchesStatus
  })

  function askDeleteGoal(id) {
    setDeleteModal({
      open: true,
      type: 'goal',
      id,
      message: 'Deseja remover esta meta?'
    })
  }

  function askDeleteBudget() {
    setDeleteModal({
      open: true,
      type: 'budget',
      id: null,
      message: 'Deseja remover o orçamento deste mês?'
    })
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

        <section className="advanced-filters-card">
          <div>
            <h2>Busca e filtros</h2>
            <p>Filtre entradas e despesas do mês selecionado</p>
          </div>

          <div className="advanced-filters-grid">
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Todos os tipos</option>
              <option value="income">Entradas</option>
              <option value="expense">Despesas</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Todas as categorias</option>
              <option value="Salário">Salário</option>
              <option value="Freelance">Freelance</option>
              <option value="Venda">Venda</option>
              <option value="Extra">Extra</option>
              <option value="Investimento">Investimento</option>
              <option value="Alimentação">Alimentação</option>
              <option value="Transporte">Transporte</option>
              <option value="Moradia">Moradia</option>
              <option value="Contas">Contas</option>
              <option value="Saúde">Saúde</option>
              <option value="Lazer">Lazer</option>
              <option value="Trabalho">Trabalho</option>
              <option value="Outros">Outros</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              disabled={filterType === 'income'}
            >
              <option value="all">Todos os status</option>
              <option value="PENDING">Pendentes</option>
              <option value="PAID">Pagas</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setFilterType('all')
                setFilterCategory('')
                setFilterStatus('all')
              }}
            >
              Limpar filtros
            </button>
          </div>
        </section>

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

        <section className="insights-card">
          <div className="insights-header">
            <div>
              <h2>Insights automáticos</h2>
              <p>Análises rápidas com base no mês selecionado</p>
            </div>
          </div>

          <div className="insights-list">
            {insights.map((insight, index) => (
              <article
                key={index}
                className={`insight-item insight-${insight.type}`}
              >
                <strong>{insight.title}</strong>
                <p>{insight.message}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="forms-grid">
          <form className="quick-form" onSubmit={handleCreateIncome}>
            <h2>Nova entrada</h2>

            <select
              value={incomeCategory}
              onChange={(e) => setIncomeCategory(e.target.value)}
            >
              <option value="">Categoria</option>
              <option value="Salário">Salário</option>
              <option value="Freelance">Freelance</option>
              <option value="Venda">Venda</option>
              <option value="Extra">Extra</option>
              <option value="Investimento">Investimento</option>
            </select>

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

            <input
              type="date"
              value={incomeDate}
              onChange={(e) => setIncomeDate(e.target.value)}
            />

            <button type="submit">Adicionar entrada</button>
          </form>

          <form className="quick-form" onSubmit={handleCreateExpense}>
            <h2>Nova despesa</h2>

            <select
              value={expenseCategory}
              onChange={(e) => setExpenseCategory(e.target.value)}
            >
              <option value="">Categoria</option>
              <option value="Alimentação">Alimentação</option>
              <option value="Transporte">Transporte</option>
              <option value="Moradia">Moradia</option>
              <option value="Contas">Contas</option>
              <option value="Saúde">Saúde</option>
              <option value="Lazer">Lazer</option>
              <option value="Trabalho">Trabalho</option>
              <option value="Outros">Outros</option>
            </select>

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

            <input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
            />

            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={expenseIsRecurring}
                onChange={(e) => setExpenseIsRecurring(e.target.checked)}
              />
              Despesa recorrente
            </label>

            {expenseIsRecurring && (
              <input
                type="number"
                min="1"
                max="31"
                placeholder="Dia do vencimento"
                value={expenseRecurrenceDay}
                onChange={(e) => setExpenseRecurrenceDay(e.target.value)}
              />
            )}

            <button type="submit">Adicionar despesa</button>
          </form>
        </section>

        <section className="lists-grid">
          <article className={`list-card ${incomes.length > 0 ? 'has-items' : ''}`}>
            <h2>Entradas</h2>

            {filteredIncomes.length === 0 ? (
              <div className="empty-state">
                <span>📥</span>
                <p>Nenhuma entrada cadastrada.</p>
              </div>
            ) : (
              filteredIncomes.map((item, index) => (
                <div key={item.id} className="list-item">
                  <div>
                    <span>{item.name}</span>
                    <small className="status-badge status-badge-neutral">
                      {item.category || 'Entrada'}
                    </small>
                  </div>

                  <div className="expense-actions">
                    <strong>{formatCurrency(item.value)}</strong>

                    <div className="item-actions-menu" ref={menuRef}>
                      <button
                        type="button"
                        className="item-menu-button"
                        onClick={(event) => {
                          event.stopPropagation()
                          setOpenMenuId(openMenuId === item.id ? null : item.id)
                        }}
                      >
                        ⋮
                      </button>

                      {openMenuId === item.id && (
                        <div
                          className={`item-menu ${index === incomes.length - 1 ? 'item-menu-up' : ''
                            }`}
                        >
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              handleEditIncome(item)
                              setOpenMenuId(null)
                            }}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              askDeleteIncome(item.id)
                              setOpenMenuId(null)
                            }}
                          >
                            Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </article>

          <article className={`list-card ${expenses.length > 0 ? 'has-items' : ''}`}>
            <h2>Despesas</h2>

            {filteredExpenses.length === 0 ? (
              <div className="empty-state">
                <span>🧾</span>
                <p>Nenhuma despesa cadastrada.</p>
              </div>
            ) : (
              filteredExpenses.map((item, index) => (
                <div key={item.id} className="list-item">
                  <div>
                    <span>{item.name}</span>
                    <small
                      className={`status-badge ${item.status === 'PAID' ? 'status-badge-paid' : 'status-badge-pending'
                        }`}
                    >
                      {formatStatus(item.status)}
                    </small>
                  </div>

                  <div className="expense-actions">
                    <strong
                      className={item.status === 'PAID' ? 'status-paid' : 'status-pending'}
                    >
                      {formatCurrency(item.value)}
                    </strong>

                    <div className="item-actions-menu">
                      <button
                        type="button"
                        className="item-menu-button"
                        onClick={(event) => {
                          event.stopPropagation()
                          setOpenMenuId(openMenuId === item.id ? null : item.id)
                        }}
                      >
                        ⋮
                      </button>

                      {openMenuId === item.id && (
                        <div
                          className={`item-menu ${index === expenses.length - 1 ? 'item-menu-up' : ''
                            }`}
                        >
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              handleEditExpense(item)
                              setOpenMenuId(null)
                            }}
                          >
                            Editar
                          </button>

                          {item.status === 'PENDING' ? (
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation()
                                handlePayExpense(item.id)
                                setOpenMenuId(null)
                              }}
                            >
                              Marcar como pago
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation()
                                handlePendingExpense(item.id)
                                setOpenMenuId(null)
                              }}
                            >
                              Marcar como pendente
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              askDeleteExpense(item.id)
                              setOpenMenuId(null)
                            }}
                          >
                            Excluir
                          </button>
                        </div>
                      )}
                    </div>
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

        <section className="card budget-card">
          <h2>Orçamento mensal</h2>

          <form onSubmit={handleSaveBudget}>
            <input
              type="number"
              placeholder="Orçamento do mês"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
            />

            <button type="submit">
              Salvar orçamento
            </button>
          </form>

          {budget && (
            <div className="budget-info">
              <div className="budget-row">
                <span>Orçamento atual</span>
                <strong>{formatCurrency(budget.amount)}</strong>
              </div>

              <div className="budget-row">
                <span>Gasto no mês</span>
                <strong>{formatCurrency(summary.totalExpenses)}</strong>
              </div>

              <div className="budget-row">
                <span>Restante</span>
                <strong className={budgetRemaining >= 0 ? 'status-paid' : 'status-pending'}>
                  {formatCurrency(budgetRemaining)}
                </strong>
              </div>

              <div className="progress">
                <div
                  className={`progress-bar ${budgetUsed > 100 ? 'danger' : ''}`}
                  style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                />
              </div>

              <small>
                {budgetUsed.toFixed(0)}% do orçamento usado
              </small>

              <button
                type="button"
                className="delete-budget-button"
                onClick={askDeleteBudget}
              >
                Remover orçamento
              </button>

              {budgetUsed >= 100 && (
                <p className="budget-alert">
                  Atenção: você ultrapassou o orçamento deste mês.
                </p>
              )}
            </div>
          )}
        </section>

        <section className="card">
          <h2>Metas financeiras</h2>

          <form onSubmit={handleCreateGoal}>
            <input
              type="text"
              placeholder="Nome da meta"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
            />

            <input
              type="number"
              placeholder="Valor alvo"
              value={goalTargetAmount}
              onChange={(e) => setGoalTargetAmount(e.target.value)}
            />

            <input
              type="number"
              placeholder="Valor atual"
              value={goalCurrentAmount}
              onChange={(e) => setGoalCurrentAmount(e.target.value)}
            />

            <input
              type="date"
              value={goalDeadline}
              onChange={(e) => setGoalDeadline(e.target.value)}
            />

            <button type="submit">
              {editingGoalId ? 'Salvar meta' : 'Criar meta'}
            </button>
          </form>

          <div>
            {goals.map((goal) => {
              const progress = goal.targetAmount > 0
                ? (goal.currentAmount / goal.targetAmount) * 100
                : 0

              return (
                <div key={goal.id} className="goal-card">
                  <strong>{goal.name}</strong>

                  <p>
                    R$ {Number(goal.currentAmount).toFixed(2)} / R$ {Number(goal.targetAmount).toFixed(2)}
                  </p>

                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>

                  <small>{progress.toFixed(0)}%</small>

                  <div className="goal-actions">
                    <button
                      type="button"
                      onClick={() => handleEditGoal(goal)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="delete-goal-button"
                      onClick={() => askDeleteGoal(goal.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

      </main>
    </AppLayout>
  )
}
