
import { User } from '../models/User.js'

export async function checkUserActive(req, res, next) {

    // Si no hay usuario conectado, continuar
    if (!req.session.user) {
        return next()
    }

    try {

        const user = await User.findByPk(
            req.session.user.userid
        )

        // Verificar si la cuenta está inactiva
        if (!user || user.estadoUsuario !== 'activa') {

            // Permitir cerrar sesión
            if (req.method === 'GET' && req.path === '/logout') {
                return next()
            }

            // Permitir ver contenido público
            if (req.method === 'GET' &&
                (req.path === '/' ||
                 req.path === '/post' ||
                 req.path.startsWith('/post/'))) {

                return next()
            }

            // Bloquear otras acciones
            return res.status(403).render('error', {
                msg: 'Tu cuenta está inactiva. No podés realizar esta acción.'
            })
        }

        next()

    } catch (error) {

        console.error('Error al verificar usuario:', error)

        return res.status(500).render('error', {
            msg: 'Error al verificar el estado del usuario'
        })
    }
}
