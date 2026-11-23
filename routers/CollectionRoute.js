import { Router } from "express";

import{
    getCollections,
    createCollection,
    savePostToCollection,
    getCollectionById
}from "../controllers/CollectionController.js";

const router=Router()


router.get('/', getCollections)
router.post('/crear', createCollection)
router.post('/guardar/:postId', savePostToCollection)
router.get('/:id',getCollectionById)

export default router