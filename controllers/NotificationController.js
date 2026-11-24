import { Notification } from '../models/Notification.js'
import { User } from '../models/User.js'
import { Post } from '../models/Post.js'
import { Image } from '../models/Image.js'


export async function createNotification(type,idSender,idReceiver,idPost ,idImage) {

    // Evitar que un usuario se notifique a sí mismo
    if (idSender === idReceiver) {
        return
    }

    try {
        await Notification.create({
            type: type,
            idSender: idSender,
            idReceiver: idReceiver,
            idPost: idPost,
            idImage: idImage,
            isRead: false
        })

    } catch (error) {
        console.error('Error al crear la notificación:', error)
    }
}

export async function getNotifications(req, res) {
    if (!req.session.user) {
        return res.redirect('/login')
    }

    const idUser = req.session.user.userid

    try {
        const notifications = await Notification.findAll({
            where: {
                idReceiver: idUser
            },
            include: [
                {
                    model: User,
                    as: 'Sender',
                    attributes: ['userid', 'fullName', 'avatar']
                },
                {
                    model: Post,
                    attributes: ['postid', 'title']
                },
                {
                    model: Image,
                    attributes: ['imageid', 'image']
                }
            ],
            order: [['createdAt', 'DESC']]
        })

        res.render('notifications', {
            notifications
        })

    } catch (error) {
        console.error(error)
        res.status(500).send('Error al obtener las notificaciones')
    }
}

export async function markAsRead(req, res) {
    if (!req.session.user) {
        return res.redirect('/login')
    }

    const notificationId = Number(req.params.notificationId)
    const idUser = req.session.user.userid

    if (notificationId % 1 !== 0 || notificationId <= 0) {
        return res.status(400).send('ID de notificación inválido')
    }

    try {
        // Buscar la notificación del usuario conectado
        const notification = await Notification.findOne({
            where: {
                notificationid: notificationId,
                idReceiver: idUser
            }
        })

        if (!notification) {
            return res.status(404).send(
                'Notificación no encontrada o acceso no permitido'
            )
        }

        // Marcar la notificación como leída
        await notification.update({
            isRead: true
        })

        res.redirect('/notificaciones')

    } catch (error) {
        console.error(error)
        res.status(500).send('Error al marcar la notificación como leída')
    }
}