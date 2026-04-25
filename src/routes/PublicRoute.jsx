import { Navigate } from 'react-router-dom'

export default function PublicRoute({ children }) {
  const token = localStorage.getItem('@finance:token')

  if (token) {
    return <Navigate to="/dashboard" />
  }

  return children
}