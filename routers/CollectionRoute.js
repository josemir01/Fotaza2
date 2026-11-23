import { Router } from "express";

import{
    getCollections,
    createCollection
}from "../controllers/CollectionController.js";

const router=Router()


router.get('/', getCollections)
router.post('/crear', createCollection)

export default router