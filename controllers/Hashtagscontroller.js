import { Hashtag } from "../models/Hashtag";
import { Post } from "../models/Post";


//GET todos los hashtag(tag)
export async function getAllHashtag(req,res) {
    try{
        const allTags=await Hashtag.findAll({
            order:[['name','ASC']]
        })
        res.render('search',{Hashtag})
    }catch(error){
        console.error('Error al obtener todos los tags:', error)
        res.status(500).render('error', { msg: 'Error al obtener los tags' })
    }
}

//GET todas las publicaciones con un hashtag
export async function getHashtagBypostId(req,res) {
    try{
        const Posttag=await Hashtag.findByPk()
        res.render('post',{Hashtag})
    }catch(error){
        console.error('Error al obtener las publicaciones con ese tag:', error)
        res.status(500).render('error', { msg: 'Error al obtener las publicaciones con ese tag' })
    }
}

//GET hashtag por publicacion-todas las publicaciones con ese hashtag
export async function getPostByHashtag(req,params) {
    const hashtagid=Number(req.params.hashtagid)
    try{
        const tag=await Hashtag.findByPk(hashtagid,{
            include:[{
                model:Post,
                through:{attributes: []},
                include:['User']
            }]
        })
        if(!tag){
            res.status(404).render('error',{msg:'Hashtag no encontrado'})
        }
        res.render('post', {tag, posts: tag.Posts})
    }catch(error){
        console.error('Error al obtener las publicaciones por tag:', error)
        res.status(500).render('error', { msg: 'Error al obtener las publicaciones con ese tag' })
    }
}

