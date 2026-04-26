import { useState } from 'react'
import AppLayout from '../../components/Layout/AppLayout'
import { api } from '../../services/api'
import './Settings.css'

export default function Settings() {
  const storedUser = JSON.parse(localStorage.getItem('@finance:user'))

  const [username, setUsername] = useState(storedUser?.username || '')
  const [avatar, setAvatar] = useState(null)
  const [preview, setPreview] = useState(storedUser?.avatarUrl || '')
  const [feedback, setFeedback] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  function handleAvatarChange(event) {
    const file = event.target.files[0]

    if (!file) return

    setAvatar(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const token = localStorage.getItem('@finance:token')

    const formData = new FormData()
    formData.append('username', username)

    if (avatar) {
      formData.append('avatar', avatar)
    }

    try {
      const response = await api.patch('/user/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      localStorage.setItem('@finance:user', JSON.stringify(response.data))
      setFeedback('Perfil atualizado com sucesso.')
    } catch (error) {
      console.log(error.response?.data)
      setFeedback(error.response?.data?.message || 'Erro ao atualizar perfil.')
    }
  }

  async function handlePasswordUpdate(event) {
    event.preventDefault()

    const token = localStorage.getItem('@finance:token')
    setFeedback('')

    if (newPassword !== confirmPassword) {
      setFeedback('As novas senhas não coincidem.')
      return
    }

    try {
      const response = await api.patch('/user/password', {
        currentPassword,
        newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setFeedback(response.data.message)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordModal(false)
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Erro ao atualizar senha.')
    }
  }

  return (
    <AppLayout>
      <main className="settings-page">
        <header className="settings-header">
          <h1>Configurações</h1>
          <p>Gerencie seu perfil e avatar.</p>
        </header>

        {feedback && <div className="feedback-message">{feedback}</div>}

        <div className="settings-grid">
          <section className="settings-card profile-card">
            <form onSubmit={handleSubmit}>
              <div className="avatar-upload">
                <div className="settings-avatar">
                  {preview ? (
                    <img src={preview} alt="Avatar" />
                  ) : (
                    username.charAt(0).toUpperCase()
                  )}
                </div>

                <label>
                  Alterar avatar
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>

              <div className="settings-field">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <button type="submit">Salvar alterações</button>
            </form>
          </section>

          <div className="settings-actions-grid">
            <section className="settings-card security-card">
            <div>
              <h2>Segurança</h2>
              <p>Atualize sua senha de acesso quando necessário.</p>
            </div>

            <button type="button" onClick={() => setShowPasswordModal(true)}>
              Alterar senha
            </button>
          </section>

          <section className="settings-card danger-card">
            <div>
              <h2>Zona perigosa</h2>
              <p>Excluir sua conta remove seu perfil, entradas e despesas permanentemente.</p>
            </div>

            <button type="button" onClick={() => setShowDeleteModal(true)}>
              Deletar conta
            </button>
          </section>
          </div>
        </div>

        {showPasswordModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h2>Alterar senha</h2>
              <p>Informe sua senha atual e defina uma nova senha.</p>

              <form onSubmit={handlePasswordUpdate}>
                <div className="settings-field">
                  <label>Senha atual</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="settings-field">
                  <label>Nova senha</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="settings-field">
                  <label>Confirmar nova senha</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowPasswordModal(false)}>
                    Cancelar
                  </button>

                  <button type="submit">
                    Salvar nova senha
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </AppLayout>
  )
}