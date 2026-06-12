import { Router } from 'express'
import jwt from 'jsonwebtoken'
import {
  validPassword,
  getUserByName,
  updateUser,
  findUserById
} from '../model/db.js'
import auth from '../middlewares/auth.js'

const router = Router()

router.get('/login', (req, res) => res.render('login'))

router.post('/login', async (req, res) => {
  const { name, password } = req.body

  if (name == undefined || password == undefined) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' })
  }
  try {
    const user = await getUserByName(name)

    if (user === undefined) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    const valid = await validPassword(password, user.user_pass)

    if (!valid)
      return res.status(401).json({ error: 'Credenciales incorrectas' })

    if (user.user_role == 'admin') {
      if (!user.updated_at || user.updated_at <= user.created_at) {
        const token = jwt.sign(
          {
            id: user.user_id,
            action: 'change-password'
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '20m'
          }
        )

        return res.status(200).json({
          redirect: `/change-password?token=${token}`
        })
      }
    }

    const token = jwt.sign(
      {
        id: user.user_id,
        name: user.user_name
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '8h'
      }
    )

    return res.status(200).json({
      redirect: `/?token=${token}`
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Error en el servidor' })
  }
})

router.get('/change-password', async (req, res) => {
  const { token } = req.query
  if (!token) {
    return res.render('change-password', {
      error: 'Token requerido',
      token: ''
    })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    if (payload.action !== 'change-password') {
      return res.render('change-password', {
        error: 'Token inválido',
        token: ''
      })
    }

    res.render('change-password', { error: false, token: token })
  } catch (err) {
    console.log(err)
    return res.render('change-password', { error: 'Token inválido', token: '' })
  }
})

router.post('/change-password', auth, async (req, res) => {
  console.log(req.body)
  const { password } = req.body

  if (req.user.action !== 'change-password') {
    return res.render('change-password', {
      error: 'Token inválido',
      token: ''
    })
  }

  try {
    const user = await findUserById(req.user.id)
    await updateUser(req.user.id, user.user_name, password, user.user_role)

    return res
      .status(200)
      .json({ message: 'Contraseña actualizada correctamente' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Error al actualizar contraseña' })
  }
})

export default router
