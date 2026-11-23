import { Router } from "express";

import{
    getCollections,
    createCollection,
    savePostToCollection,
    getCollectionById,
    removePostFromCollection
}from "../controllers/CollectionController.js";

const router=Router()


router.get('/', getCollections)
router.post('/crear', createCollection)
router.post('/guardar/:postId', savePostToCollection)
router.post('/:id/quitar/:postId',removePostFromCollection)
router.get('/:id',getCollectionById)


export default router