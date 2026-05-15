import { User } from '../models/User.js'

export async function getUsers(req,res){
      try {
        const users = await User.findAll()
        //aca irira el res. render para la vista y mostrarlo al usuario
        res.json(users)
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).send('Error al obtener los usuarios');
    }
}

export async function createUser(req,res){
  try {
        const { username, email, password } = req.body
        const user = await User.create({
            username,
            email,
            password
        })
        //aca irira el res.render o send? para la routa(vista)
        res.status(201).json(user)
    } catch (error) {
        console.error('Error al crear el archivo de usuarios:', error);
        res.status(500).send('Error al crear un usuario');
    }
}

export async function getUserById(req, res) {
    try {
        const usuarioPorid = await getUserById();
        if(!usuarioPorid){
            res.status(404).render('user/error',{msg: 'usuario no encontrado'})
            return;
        }
        const usuarioFiltrado=await getUsers(usuarioPorid)
        //aca iria el res.render para la vista

        //un res.render de los datos 
    } catch (error) {
        console.error('error al obtener el usuario', error);
        res.status(500).send('usuario no encontrado');
    }
}

