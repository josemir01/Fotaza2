import { Conversation } from '../models/Conversation.js'
import { Message } from '../models/Message.js'
import { User } from '../models/User.js'
import { Image } from '../models/Image.js'
import { Post } from '../models/Post.js'
import { Op } from 'sequelize'



export async function createConversation(req, res) {
    if (!req.session.user) {
        return res.redirect('/login')
    }

    const idImage = Number(req.params.imageId)
    const idBuyer = req.session.user.userid

    if (!Number.isInteger(idImage) || idImage <= 0) {
        return res.status(400).send('ID de imagen inválido')
    }

    try {
        // Buscar la imagen y su publicación
        const image = await Image.findByPk(idImage, {
            include: [
                {
                    model: Post
                }
            ]
        })

        if (!image || !image.Post) {
            return res.status(404).send('Imagen no encontrada')
        }

        // Verificar que la publicación esté activa
        if (image.Post.estadoPublicacion !== 'activa') {
            return res.status(403).send('Publicación no disponible')
        }

        // Obtener el ID del autor
        const idAuthor = image.Post.idUser

        // Evitar que un usuario se interese en su propia imagen
        if (idBuyer === idAuthor) {
            return res.status(400).send(
                'No podés manifestar interés en tu propia imagen'
            )
        }

        // Buscar o crear la conversación
        const [conversation, created] = await Conversation.findOrCreate({
            where: {
                idBuyer: idBuyer,
                idImage: idImage
            },
            defaults: {
                idAuthor: idAuthor
            }
        })

        // Redirigir a la conversación
        res.redirect(`/conversaciones/${conversation.conversationid}`)

    } catch (error) {
        console.error(error)
        res.status(500).send('Error al iniciar la conversación')
    }
}


export async function getConversations(req, res) {
    if (!req.session.user) {
        return res.redirect('/login')
    }

    const idUser = req.session.user.userid

    try {
        const conversations = await Conversation.findAll({
            where: {
                [Op.or]: [
                    { idBuyer: idUser },
                    { idAuthor: idUser }
                ]
            },
            include: [
                {
                    model: User,
                    as: 'Buyer',
                    attributes: ['userid', 'fullName', 'avatar']
                },
                {
                    model: User,
                    as: 'Author',
                    attributes: ['userid', 'fullName', 'avatar']
                },
                {
                    model: Image,
                    include: [
                        {
                            model: Post,
                            attributes: ['postid', 'title']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        })

        res.render('conversations', {
            conversations,
            sessionUser: req.session.user
        })

    } catch (error) {
        console.error(error)
        res.status(500).send('Error al obtener las conversaciones')
    }
}


export async function getConversationById(req, res) {
    if (!req.session.user) {
        return res.redirect('/login')
    }

    const conversationId = Number(req.params.conversationId)
    const idUser = req.session.user.userid

    if (!Number.isInteger(conversationId) || conversationId <= 0) {
        return res.status(400).send('ID de conversación inválido')
    }

    try {
        // Buscar la conversación y verificar que el usuario participe
        const conversation = await Conversation.findOne({
            where: {
                conversationid: conversationId,
                [Op.or]: [
                    { idBuyer: idUser },
                    { idAuthor: idUser }
                ]
            },
            include: [
                {
                    model: User,
                    as: 'Buyer',
                    attributes: ['userid', 'fullName', 'avatar']
                },
                {
                    model: User,
                    as: 'Author',
                    attributes: ['userid', 'fullName', 'avatar']
                },
                {
                    model: Image,
                    include: [
                        {
                            model: Post,
                            attributes: ['postid', 'title']
                        }
                    ]
                }
            ]
        })

        if (!conversation) {
            return res.status(404).send(
                'Conversación no encontrada o acceso no permitido'
            )
        }

        // Obtener los mensajes de la conversación
        const messages = await Message.findAll({
            where: {
                idConversation: conversationId
            },
            include: [
                {
                    model: User,
                    as: 'Sender',
                    attributes: ['userid', 'fullName', 'avatar']
                }
            ],
            order: [
                ['createdAt', 'ASC'],
                ['messageid', 'ASC']
            ]
        })

        // Identificar al otro participante
        let otherUser

        if (conversation.idBuyer === idUser) {
            otherUser = conversation.Author
        } else {
            otherUser = conversation.Buyer
        }

        res.render('conversationDetail', {
            conversation,
            messages,
            otherUser,
            sessionUser: req.session.user
        })

    } catch (error) {
        console.error(error)
        res.status(500).send('Error al obtener la conversación')
    }
}


export async function sendMessage(req, res) {
    if (!req.session.user) {
        return res.redirect('/login')
    }

    const conversationId = Number(req.params.conversationId)
    const idSender = req.session.user.userid
    const { texto } = req.body

    // Validar el ID de la conversación
    if (!Number.isInteger(conversationId) || conversationId <= 0) {
        return res.status(400).send('ID de conversación inválido')
    }

    // Validar que el mensaje no esté vacío
    if (typeof texto !== 'string' || !texto.trim()) {
        return res.status(400).send('El mensaje no puede estar vacío')
    }

    try {
        // Verificar que el usuario pertenezca a la conversación
        const conversation = await Conversation.findOne({
            where: {
                conversationid: conversationId,
                [Op.or]: [
                    { idBuyer: idSender },
                    { idAuthor: idSender }
                ]
            }
        })

        if (!conversation) {
            return res.status(404).send(
                'Conversación no encontrada o acceso no permitido'
            )
        }

        // Crear el mensaje
        await Message.create({
            texto: texto.trim(),
            idConversation: conversationId,
            idSender: idSender
        })

        // Volver a la conversación
        res.redirect(`/conversaciones/${conversationId}`)

    } catch (error) {
        console.error(error)
        res.status(500).send('Error al enviar el mensaje')
    }
}
