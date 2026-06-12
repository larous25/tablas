const formLogin = document.getElementById('loginForm') as HTMLFormElement
const error = document.getElementById('error') as HTMLParagraphElement

formLogin.addEventListener('submit', async (e) => {
  e.preventDefault()

  const formData = new FormData(formLogin)

  const body = {
    name: formData.get('name'),
    password: formData.get('password')
  }

  interface LoginResponse {
    redirect?: string
    action?: string
    error?: string
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

    const data: LoginResponse = await response.json()

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
