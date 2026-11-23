
import { Collection } from '../models/Collection.js'

// Crear una colección
export async function createCollection(req, res) {
    if (!req.session.user) {
        return res.redirect('/login')
    }

    const { name, description, isPrivate } = req.body

    try {
        await Collection.create({
            name,
            description,
            isPrivate: isPrivate === 'on',
            idUser: req.session.user.userid
        })

        res.redirect('/colecciones')

    } catch (error) {
        console.error(error)
        res.status(500).send('Error al crear la colección')
    }
}

// Mostrar las colecciones del usuario
export async function getCollections(req, res) {
    if (!req.session.user) {
        return res.redirect('/login')
    }

    try {
        const collections = await Collection.findAll({
            where: {
                idUser: req.session.user.userid
            }
        })

        res.render('collections', {
            collections
        })

    } catch (error) {
        console.error(error)
        res.status(500).send('Error al obtener las colecciones')
    }
}
