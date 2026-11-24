import { Router } from "express"

import {
    getNotifications,
    markAsRead
} from "../controllers/NotificationController.js"

const router = Router()

// Obtener las notificaciones del usuario
router.get('/', getNotifications)

// Marcar una notificación como leída
router.post('/:notificationId/leer', markAsRead)

export default router