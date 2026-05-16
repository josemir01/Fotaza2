import { NUMBER } from 'sequelize'
import { Post } from '../models/Post.js'
import { getUserById } from './Usercontroller.js'
import { User } from '../models/User.js'


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

export async function getPostsByUserId(req,res) {
    const usuario=Number(req.params.userId)
    try {
        const allPost=await Post.findAll({
            include:{model:User,
                required:true,
                where:{userId:usuario},
                attributes:{userId}},
        })
        return allPost;
        //return res.status(200).json(oneUser);
    } catch (error) {
            console.error('error al obtener el usuario', error);
            res.status(500).send('usuario no encontrado');
    }
    
}




export async function getGastosByUserId(req, res) {
  const usuarioId = Number(req.params.id)
  try {
    const usuarioEncontrado = await getOneUsuarioById(usuarioId);

    if(!usuarioEncontrado){
      res.status(404).render('gastos/error', { msg: 'Usuario no encontrado' });
      return;
    }

    const gastosFiltrados = await getAllGastosByUserId(usuarioEncontrado.id);

    res.render('gastos/byuser', { 
      gastos: gastosFiltrados,
      user: {
        id: usuarioEncontrado.id,
        nombre: usuarioEncontrado.nombre
      }
    });
  } catch (error) {
    console.error('Error al leer el archivo de gastos:', error);
    res.status(500).send('Error al cargar los gastos');
  }
}