import 'dotenv/config'
import * as mariadb from 'mariadb'
import bcrypt from 'bcryptjs'

const adminConnection = await mariadb.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
})

try {
  // 2. Crear la base de datos si no existe
  await adminConnection.query(
    `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
  )
  console.log(`Base de datos '${process.env.DB_NAME}' verificada/creada.`)
} catch (err) {
  console.error('Error al crear la base de datos:', err)
} finally {
  // 3. Cerrar la conexión administrativa
  await adminConnection.end()
}

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
})

// Inicialización de la Base de Datos
async function initDatabase() {
  const conn = await pool.getConnection()
  try {
    // Crear tablas
    await conn.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id INT NOT NULL AUTO_INCREMENT,
                user_name VARCHAR(50) NOT NULL UNIQUE,
                user_pass VARCHAR(255) NOT NULL,
                user_role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id)
            )
        `)

    await conn.query(`
            CREATE TABLE IF NOT EXISTS products (
                product_id INT NOT NULL AUTO_INCREMENT,
                product_name VARCHAR(50),
                product_price DECIMAL(13,2),
                PRIMARY KEY (product_id)
            )
        `)

    await conn.query(`
            CREATE TABLE IF NOT EXISTS orders (
                order_id INT NOT NULL AUTO_INCREMENT,
                order_user_id INT,
                order_product_id INT,
                order_unit_price DECIMAL(13,2),
                order_quantity INT,
                order_subtotal DECIMAL(13,2),
                order_tax DECIMAL(13,2),
                order_total DECIMAL(13,2),
                PRIMARY KEY (order_id)
            )
        `)

    const hash = await setPassword(process.env.USER_ADMIN_PASSWORD)

    await conn.query(
      `
            INSERT INTO users (user_name, user_pass, user_role)
            SELECT ?, ?, ?
            FROM DUAL
            WHERE NOT EXISTS (
                SELECT 1
                FROM users
                WHERE user_name = ?
            )
        `,
      [process.env.USER_ADMIN_NAME, hash, 'admin', process.env.USER_ADMIN_NAME]
    )

    console.log('Base de datos y tablas inicializadas.')
  } catch (err) {
    console.error('Error al inicializar la BD:', err)
  } finally {
    conn.release()
  }
}

//   CREATES

const createUser = async (nombre, pass) => {
  const conn = await pool.getConnection()
  const query =
    'INSERT INTO users (user_name, user_pass, user_role, created_at, updated_at) VALUES (?, ?, "user", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
  try {
    await conn.query(query, [nombre, setPassword(pass)])
    console.log('Usuario creado exitosamente.')
  } catch (err) {
    console.error('Error al crear usuario:', err)
  } finally {
    conn.release()
  }
}

const createProduct = async (des, valor) => {
  const conn = await pool.getConnection()
  const query =
    'INSERT INTO products (product_description, product_price) VALUES (?, ?)'
  try {
    await conn.query(query, [des, valor])
    console.log('Producto creado exitosamente.')
  } catch (err) {
    console.error('Error al crear producto:', err)
  } finally {
    conn.release()
  }
}

// Selects

const getAllUsers = async () => {
  const query = 'SELECT * FROM users'
  const conn = await pool.getConnection()
  try {
    const rows = await conn.query(query)
    return rows
  } catch (err) {
    console.error('Error al obtener usuarios:', err)
    throw err
  } finally {
    conn.release()
  }
}

const getSomeUsers = async (limit, offset) => {
  const query = 'SELECT * FROM users LIMIT ? OFFSET ?'
  const conn = await pool.getConnection()
  try {
    const rows = await conn.query(query, [limit, offset])
    return rows
  } catch (err) {
    console.error('Error al obtener usuarios:', err)
    throw err
  } finally {
    conn.release()
  }
}

const getUserByName = async (nombre) => {
  const query = 'SELECT * FROM users WHERE user_name = ?'
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query(query, [nombre])
    return rows
  } catch (err) {
    console.error('Error al obtener usuario:', err)
    throw err
  } finally {
    conn.release()
  }
}

const getAllProducts = async () => {
  const query = 'SELECT * FROM products'
  const conn = await pool.getConnection()
  try {
    const rows = await conn.query(query)
    return rows
  } catch (err) {
    console.error('Error al obtener productos:', err)
    throw err
  } finally {
    conn.release()
  }
}

const getSomeProducts = async (limit, offset) => {
  const query = 'SELECT * FROM products LIMIT ? OFFSET ?'
  const conn = await pool.getConnection()
  try {
    const rows = await conn.query(query, [limit, offset])
    return rows
  } catch (err) {
    console.error('Error al obtener productos:', err)
    throw err
  } finally {
    conn.release()
  }
}

const getTotalPages = async (quantity, table) => {
  const query = `SELECT CEIL(COUNT(*) / ?) AS total_pages FROM ${table};`
  const conn = await pool.getConnection()
  try {
    const [q] = await conn.query(query, [quantity])
   
    return q.total_pages
  } catch (error) {
    console.error('Error al obtener productos:', err)
    throw err
  } finally {
    conn.release()
  }
}


const findUserById = async (id) => {
  const query = 'SELECT * FROM users WHERE user_id = ?'
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query(query, [id])
    return rows
  } catch (err) {
    console.error('Error al obtener usuario por ID:', err)
    throw err
  } finally {
    conn.release()
  }
}

// Updates

const updateUser = async (id, name, pass, role) => {
  const conn = await pool.getConnection()

  const query = `
        UPDATE users
        SET user_name = ?, user_pass = ?, user_role = ?
        WHERE user_id = ?
    `
  try {
    const hashPass = await setPassword(pass)
    await conn.query(query, [name, hashPass, role, id])
    console.log('Usuario actualizado exitosamente.')
  } catch (err) {
    console.error('Error al actualizar usuario:', err)
  } finally {
    conn.release()
  }
}

// const updateProduct = async (des, valor) => {
//     const conn = await pool.getConnection()
//     const query =
//         'UPDATE products SET product_description = ?, product_price = ? WHERE product_id = ?'
//     try {
//         await conn.query(query, [des, valor])
//         console.log('Producto creado exitosamente.')
//     } catch (err) {
//         console.error('Error al crear producto:', err)
//     } finally {
//         conn.release()
//     }
// }

// Utils

async function setPassword(pass) {
  return await bcrypt.hash(pass, 12)
}

async function validPassword(pass, hash) {
  return await bcrypt.compare(pass, hash)
}

export {
  createUser,
  createProduct,
  validPassword,
  initDatabase,
  getUserByName,
  updateUser,
  findUserById,
  getAllUsers,
  getAllProducts,
  getSomeProducts,
  getSomeUsers,
  getTotalPages
}
