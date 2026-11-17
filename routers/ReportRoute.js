import { Router } from 'express'

import {
    reportComment,
    reportImage,
    getCommentReports,
    dismissCommentReport,
    deleteReportedComment
} from '../controllers/ReportController.js'

const router = Router()

router.post('/comentario/:commentId',reportComment)
router.post('/imagen/:imageId', reportImage)
router.get('/publicacion/:postId/comentarios', getCommentReports)
router.post('/comentario/:commentId/desestimar', dismissCommentReport)
router.post('/comentario/:commentId/eliminar', deleteReportedComment)

export default router