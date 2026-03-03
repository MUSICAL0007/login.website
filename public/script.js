document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm')
  const registerForm = document.getElementById('registerForm')
  const messageDiv = document.getElementById('message')

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault()
      const username = loginForm.username.value
      const password = loginForm.password.value

      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await res.json()
      if (res.ok) {
        messageDiv.style.color = 'green'
        messageDiv.textContent = data.message
      } else {
        messageDiv.style.color = 'red'
        messageDiv.textContent = data.error
      }
    })
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault()
      const username = registerForm.username.value
      const password = registerForm.password.value

      const res = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await res.json()
      if (res.ok) {
        messageDiv.style.color = 'green'
        messageDiv.textContent = data.message
        registerForm.reset()
      } else {
        messageDiv.style.color = 'red'
        messageDiv.textContent = data.error
      }
    })
  }
})
