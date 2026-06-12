'use strict'
const formLogin = document.getElementById('loginForm')
const error = document.getElementById('error')
formLogin.addEventListener('submit', async (e) => {
  e.preventDefault()
  const formData = new FormData(formLogin)
  const body = {
    name: formData.get('name'),
    password: formData.get('password')
  }
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      redirect: 'follow'
    })
    const data = await response.json()
    if (data.redirect) {
      window.location.href = data.redirect
    } else if (data.error) {
      error.textContent = data.error
    }
  } catch (err) {
    error.textContent = 'Error de conexión'
    console.error(err)
  }
})
//# sourceMappingURL=login.js.map
