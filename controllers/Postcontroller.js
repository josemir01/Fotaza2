import { Post } from '../models/Post.js'


export async function createPost(req,res){
        try {
        const { content, userId } = req.body
        const post = await Post.create({
            content,
            userId
        })
        res.status(201).json(post)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

export async function getPosts(req,res){
    try {
        const post=await Post.findAll()
        //logica de render en la vista
    } catch (error) {
        console.log(err)
        res.status(500).send('error al obtener las publicaciones')
    }
}


export async function getPostsById(req,res){
    try {
        const postPorId=await getPostsById()
        if(!postPorId){
            res.status(404).render('post/error',{msg:'post no encontrado'})
            return
        }
        const postFiltrado=await getPostsById(postPorId)
        //res.render por la vista
    } catch (error) {
        console.error(error)
        res.status(500).send("post no encontrado")
    }
}


export async function deletePost(params) {
    try {
        
    } catch (error) {
        console.error('+',error)
    }
}