import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

interface Task { id: number; title: string; description?: string; completed: boolean }

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    axios.get('http://localhost:3000/tasks', { headers }).then(r => setTasks(r.data))
  }, [])

  const createTask = async () => {
    if (!title.trim()) return
    const res = await axios.post('http://localhost:3000/tasks', { title, description }, { headers })
    setTasks([...tasks, res.data])
    setTitle('')
    setDescription('')
  }

  const toggleTask = async (task: Task) => {
    const res = await axios.patch(`http://localhost:3000/tasks/${task.id}`, { completed: !task.completed }, { headers })
    setTasks(tasks.map(t => t.id === task.id ? res.data : t))
  }

  const deleteTask = async (id: number) => {
    await axios.delete(`http://localhost:3000/tasks/${id}`, { headers })
    setTasks(tasks.filter(t => t.id !== id))
  }

  const logout = () => { localStorage.removeItem('token'); navigate('/login') }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Mis tareas</h1>
        <button style={styles.logoutBtn} onClick={logout}>Cerrar sesión</button>
      </div>
      <div style={styles.form}>
        <input style={styles.input} placeholder="Nueva tarea..." value={title} onChange={e => setTitle(e.target.value)} />
        <input style={styles.input} placeholder="Descripción (opcional)" value={description} onChange={e => setDescription(e.target.value)} />
        <button style={styles.btn} onClick={createTask}>Agregar</button>
      </div>
      <div>
        {tasks.map(task => (
          <div key={task.id} style={styles.task}>
            <div style={{ flex: 1 }}>
              <p style={{ ...styles.taskTitle, textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#999' : '#111' }}>{task.title}</p>
              {task.description && <p style={styles.taskDesc}>{task.description}</p>}
            </div>
            <button style={styles.checkBtn} onClick={() => toggleTask(task)}>{task.completed ? '↩' : '✓'}</button>
            <button style={styles.deleteBtn} onClick={() => deleteTask(task.id)}>✕</button>
          </div>
        ))}
        {tasks.length === 0 && <p style={styles.empty}>No tienes tareas aún. ¡Crea una!</p>}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title: { fontSize: '24px', fontWeight: 600, margin: 0 },
  logoutBtn: { background: 'none', border: '1px solid #ddd', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '13px', color: '#666' },
  form: { background: '#fff', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '1.5rem' },
  input: { display: 'block', width: '100%', padding: '10px 12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '10px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' },
  task: { background: '#fff', padding: '1rem', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' },
  taskTitle: { margin: 0, fontSize: '15px', fontWeight: 500 },
  taskDesc: { margin: '2px 0 0', fontSize: '13px', color: '#888' },
  checkBtn: { background: '#e8f5e9', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '16px' },
  deleteBtn: { background: '#fce8e8', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '14px', color: '#e53e3e' },
  empty: { textAlign: 'center', color: '#999', marginTop: '2rem' },
}