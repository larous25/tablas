import jwt from 'jsonwebtoken'

async function auth(req, res, next) {
  console.log('Middleware de autenticación ejecutado', req.url)
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({
      message: 'Token requerido'
    })
  }

  try {
    const payload = await jwt.verify(token, process.env.JWT_SECRET)

    req.user = payload

    next()
  } catch {
    return res.status(401).json({
      message: 'Token inválido'
    })
  }
}

export default auth
