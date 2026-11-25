import bcrypt from 'bcrypt'
import { User } from '../models/User.js'


export async function getLogin(req, res) {
    res.render('login')
}
// GET /registro — mostrar formulario de registro
export async function getRegister(req, res) {
    res.render('signin')
}


// POST /registro — crear nuevo usuario
export async function createUser(req, res) {
    try {
        const { fullName, email, password, confirmPassword, birthDate } = req.body

        // Validaciones básicas
        if (!fullName || !email || !password) {
            return res.status(400).render('signin', {
                error: 'Nombre, email y contraseña son obligatorios'
            })
        }

        //Verificar si las contraseñas coinciden
        if (password !== confirmPassword) {
            return res.status(400).render('sigin', {
                error: 'Las contraseñas no coinciden'
            })
        }

        // Verificar si el email ya existe
        const existing = await User.findOne({ where: { email } })
        if (existing) {
            return res.status(400).render('signin', {
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

        // Verificar si el usuario está inactivo
        if (user.estadoUsuario !== 'activa') {
            return res.status(403).render('login', {
                error: 'Tu cuenta fue inactivada. No podés iniciar sesión.'
            })
        }

        // Guardar usuario en sesión (sin contraseña)
        req.session.user = {
            userid: user.userid,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar,
            rol: user.rol
        }

        res.redirect('/')
    } catch (error) {
        console.error('Error en login:', error)
        res.status(500).render('error', { msg: 'Error al iniciar sesión' })
    }
}

// GET /logout — cerrar sesión
export async function logoutUser(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err)
            return res.status(500).render('error', { msg: 'Error al cerrar sesión' })
        }
        res.redirect('/login')
    })
}
