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

    const response = await api.patch('/user/profile', formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    localStorage.setItem('@finance:user', JSON.stringify(response.data))
    setFeedback('Perfil atualizado com sucesso.')
  }

  return (
    <AppLayout>
      <main className="settings-page">
        <header className="settings-header">
          <h1>Configurações</h1>
          <p>Gerencie seu perfil e avatar.</p>
        </header>

        {feedback && <div className="feedback-message">{feedback}</div>}

        <section className="settings-card">
          <form onSubmit={handleSubmit}>
            <div className="avatar-upload">
              <div className="settings-avatar">
                {preview ? (
                  <img
                    src={
                      preview.startsWith('blob:')
                        ? preview
                        : `http://localhost:3000${preview}`
                    }
                    alt="Avatar"
                  />
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
      </main>
    </AppLayout>
  )
}