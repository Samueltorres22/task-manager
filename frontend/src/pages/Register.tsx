import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:3000/auth/register', { name, email, password })
      localStorage.setItem('token', res.data.access_token)
      navigate('/tasks')
    } catch {
      setError('Error al registrarse')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Crear cuenta</h1>
        <p style={styles.sub}>Empieza a organizar tus tareas</p>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
        <input style={styles.input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={styles.input} placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button style={styles.btn} onClick={handleSubmit}>Registrarse</button>
        <p style={styles.link}>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' },
  card: { background: '#fff', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  title: { margin: '0 0 4px', fontSize: '24px', fontWeight: 600 },
  sub: { margin: '0 0 1.5rem', color: '#666', fontSize: '14px' },
  input: { display: 'block', width: '100%', padding: '10px 12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '10px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' },
  error: { color: '#e53e3e', fontSize: '13px', marginBottom: '12px' },
  link: { textAlign: 'center', fontSize: '13px', marginTop: '1rem', color: '#666' },
}