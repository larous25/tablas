import { Router } from 'express'
import routerLogin from './login.router.js'
import routerProducts from './products.router.js'
import routerUsers from './users.router.js'
import jwt from 'jsonwebtoken'
import { getSomeUsers, getSomeProducts, getTotalPages } from '../model/db.js'
import { checkIntergerAndSetValue } from '../utils/tools.js'

const router = Router()

router.use(routerLogin)

router.get('/', async (req, res) => {
  const {
    t: tap = 0,
    token: authToken,
    up: usersPage = 1,
    pp: productsPage = 1
  } = req.query

  const viewData = {
    authToken,
    redirect: '',
    error: '',
    users: null,
    products: null,
    usersTotalPages: null,
    productsTotalPages: null,
    usersPage: checkIntergerAndSetValue(Number(usersPage), 1),
    productsPage: checkIntergerAndSetValue(Number(productsPage), 1),
    tap: checkIntergerAndSetValue(Number(tap), 0)
  }

  if (!authToken) {
    viewData.redirect = '/login'
    return res.render('index', viewData)
  }

  try {
    jwt.verify(authToken, process.env.JWT_SECRET)
  } catch (error) {
    console.error('Token inválido:', error)

    viewData.authToken = null
    viewData.error = 'Token inválido'
    viewData.redirect = '/login'

    return res.render('index', viewData)
  }

  try {
    const recordsPerPage = 10

    const usersOffset = (usersPage - 1) * recordsPerPage
    const productsOffset = (productsPage - 1) * recordsPerPage

    viewData.users = await getSomeUsers(recordsPerPage, usersOffset)

    viewData.products = await getSomeProducts(recordsPerPage, productsOffset)

    viewData.usersTotalPages = await getTotalPages(recordsPerPage, 'users')

    viewData.productsTotalPages = await getTotalPages(
      recordsPerPage,
      'products'
    )

    return res.render('index', viewData)
  } catch (error) {
    console.error('Error cargando datos del index:', error)

    viewData.error = 'Error interno'
    return res.render('index', viewData)
  }
})

router.use(routerProducts)
router.use(routerUsers)

export default router
