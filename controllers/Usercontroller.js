import { Model } from 'sequelize'
import { User } from '../models/User.js'
import { Follow } from '../models/Follow.js'
import bcrypt from 'bcrypt'




///////////////////////////////////////////////////////////////////////////////////////////////////////////


// GET /usuario — lista todos los usuarios (vista admin o interna)
export async function getUsers(req, res) {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        })
        res.render('user/index', { users })
    } catch (error) {
        console.error('Error al obtener usuarios:', error)
        res.status(500).render('error', { msg: 'Error al obtener los usuarios' })
    }
}

// GET /usuario/:userId — perfil de un usuario
export async function getUserById(req, res) {
    const userId = Number(req.params.userId)
    try {
        const user = await User.findOne({
            where: { userid: userId },
            attributes: { exclude: ['password', 'email'] },
            include: [
                {
                    model: User,
                    as: 'Followers',
                    attributes: ['userid', 'fullName', 'avatar'],
                    through: { attributes: [] }
                },
                {
                    model: User,
                    as: 'Following',
                    attributes: ['userid', 'fullName', 'avatar'],
                    through: { attributes: [] }
                }
            ]
        })
        if (!user) {
            return res.status(404).render('user/error', { msg: 'Usuario no encontrado' })
        }
        res.render('profile', {
            user,
            followers: user.Followers || [],
            following: user.Following || []

        })
    } catch (error) {
        console.error('Error al obtener el usuario:', error)
        res.status(500).render('error', { msg: 'Error interno al obtener el usuario' })
    }
}

// POST /usuario/registro — crear nuevo usuario (registro)
export async function createUser(req, res) {
    try {
        const { fullName, email, password, birthDate } = req.body

        // Validaciones básicas
        if (!fullName || !email || !password) {
            return res.status(400).render('user', {
                error: 'Nombre, email y contraseña son obligatorios'
            })
        }

        // Verificar si el email ya existe
        const existing = await User.findOne({ where: { email } })
        if (existing) {
            return res.status(400).render('user/register', {
                error: 'Ya existe una cuenta con ese email'
            })
        }

        // Hashear la contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            birthDate: birthDate || null
        })

        // Redirigir al login tras registro exitoso
        res.redirect('/login')
    } catch (error) {
        console.error('Error al crear el usuario:', error)
        res.status(500).render('error', { msg: 'Error al registrar el usuario' })
    }
}

// POST /login — autenticar usuario con sesión
export async function loginUser(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).render('login', { error: 'Email y contraseña son obligatorios' })
        }

        const user = await User.findOne({ where: { email } })
        if (!user) {
            return res.status(401).render('login', { error: 'Credenciales incorrectas' })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(401).render('login', { error: 'Credenciales incorrectas' })
        }

        // Guardar usuario en sesión (sin contraseña)
        req.session.user = {
            userid: user.userid,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar
        }

        res.redirect('/')
    } catch (error) {
        console.error('Error en login:', error)
        res.status(500).render('error', { msg: 'Error al iniciar sesión' })
    }
}

// POST /logout — cerrar sesión
export async function logoutUser(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err)
            return res.status(500).render('error', { msg: 'Error al cerrar sesión' })
        }
        res.redirect('/login')
    })
}

// GET /usuario/:userId/editar — mostrar formulario de edición
export async function getEditUser(req, res) {
    const userId = Number(req.params.userId)
    try {
        // Solo el propio usuario puede editar su perfil
        if (req.session.user?.userid !== userId) {
            return res.status(403).render('error', { msg: 'No tenés permiso para editar este perfil' })
        }
        const user = await User.findOne({
            where: { userid: userId },
            attributes: { exclude: ['password'] }
        })
        if (!user) {
            return res.status(404).render('user/error', { msg: 'Usuario no encontrado' })
        }
        res.render('user/edit', { user })
    } catch (error) {
        console.error('Error al obtener el usuario para edición:', error)
        res.status(500).render('error', { msg: 'Error interno' })
    }
}

// POST /usuario/:userId/editar — guardar cambios del perfil
export async function updateUser(req, res) {
    const userId = Number(req.params.userId)
    try {
        if (req.session.user?.userid !== userId) {
            return res.status(403).render('error', { msg: 'No tenés permiso para editar este perfil' })
        }

        const { fullName, birthDate } = req.body

        await User.update(
            { fullName, birthDate: birthDate || null },
            { where: { userid: userId } }
        )

        res.redirect(`/usuario/${userId}`)
    } catch (error) {
        console.error('Error al actualizar el usuario:', error)
        res.status(500).render('error', { msg: 'Error al actualizar el usuario' })
    }
}


export async function followUser(req, res) {
    const followingId = Number(req.params.userId)
    // temporal mientras no haya login
    const followerId = 1
    try {
        // evitar seguirse a sí mismo
        // if (followingId === followerId) {
        //     return res.redirect('/post')
        // }

        // verificar si ya lo sigue
        const existingFollow = await Follow.findOne({
            where: {
                followerId,
                followingId
            }
        })

        // si no existe crear follow
        if (!existingFollow) {
            await Follow.create({
                followerId,
                followingId
            })
        }
        res.redirect('/post')
    } catch (error) {
        console.error('Error al seguir al usuario:', error)
        res.status(500).render('error', { msg: 'Error al seguir al usuario' })
    }
}