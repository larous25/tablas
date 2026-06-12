'use strict'
const formCPassword = document.querySelector('#changePasswordForm')
formCPassword?.addEventListener('submit', async (e) => {
  e.preventDefault()
  const token = window.location.search.split('token=')[1]
  const password = document.querySelector('#password')?.value
  try {
    const response = await fetch('/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({
        password
      })
    })
    const data = await response.json()
    if (!response.ok) {
      window.location.href = '/login'
      return
    }
  } catch (error) {
    console.error(error)
    document.querySelector('#error').textContent = 'Error de conexión'
  }
})
//# sourceMappingURL=change-password.js.map
