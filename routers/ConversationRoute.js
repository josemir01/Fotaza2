
import { Router } from "express"

import {
    createConversation,
    getConversations,
    getConversationById,
    sendMessage
} from "../controllers/ConversationController.js"

const router = Router()

// Listar las conversaciones del usuario
router.get('/', getConversations)

// Registrar interés en una imagen
router.post('/crear/:imageId', createConversation)

// Visualizar una conversación privada
router.get('/:conversationId', getConversationById)

// Enviar un mensaje
router.post('/:conversationId/mensaje', sendMessage)

export default router
