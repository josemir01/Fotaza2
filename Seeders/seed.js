import bcrypt from 'bcrypt'

import { User } from '../models/User.js'
import { Hashtag } from '../models/Hashtag.js'

export async function seed() {

    const password = await bcrypt.hash('123456', 10)

    // Usuarios

    const usuarioExiste = await User.findOne({
        where: {
            email: 'juan@test.com'
        }
    })

    if (!usuarioExiste) {
        await User.create({
            fullName: 'Juan Perez',
            email: 'juan@test.com',
            password,
            rol: 'USER'
        })
    }

    const usuarioExiste2 = await User.findOne({
        where: {
            email: 'maria@test.com'
        }
    })

    if (!usuarioExiste2) {
        await User.create({
            fullName: 'Maria Gomez',
            email: 'maria@test2.com',
            password,
            rol: 'USER'
        })
    }

        const usuarioExiste3 = await User.findOne({
        where: {
            email: 'gonzalo@test.com'
        }
    })

        if (!usuarioExiste3) {
        await User.create({
            fullName: 'Gonzalo armando',
            email: 'gonzalo@test.com',
            password,
            rol: 'USER'
        })
    }


    // Hashtags

    const hashtags = await Hashtag.count()

    if (hashtags === 0) {
        await Hashtag.bulkCreate([
            { name: 'naturaleza' },
            { name: 'musica' },
            { name: 'viajes' },
            { name: 'arte' }
        ])
    }


    console.log('Seeder ejecutado correctamente')
}