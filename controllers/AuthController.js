import bcrypt from 'bcrypt'
import { User } from '../models/User.js'


export async function getLogin(req, res) {
    res.render('login')
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
