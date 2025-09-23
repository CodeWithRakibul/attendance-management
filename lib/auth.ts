// Simple demo users for client demo
const DEMO_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: '2', 
    username: 'teacher',
    password: 'teacher123',
    role: 'teacher',
    name: 'Teacher User'
  }
]

export function authenticateUser(username: string, password: string) {
  const user = DEMO_USERS.find(u => u.username === username && u.password === password)
  return user ? {
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name
  } : null
}