import { User } from "./User.js"
import { Comment } from './Comment.js'
import { Post } from "./Post.js"
import { Follow } from "./Follow.js"
import { Like } from "./Like.js"
import { Rating } from "./Rating.js"
import { Image } from "./Image.js"
import { Report } from "./Report.js"
import { Hashtag } from "./Hashtag.js"
import { Collection } from "./Collection.js"
import sequelize from "../db/config.js"
import { seed } from "../Seeders/seed.js"

//un usuario tiene muchas publicaciones (1:n)
User.hasMany(Post, { foreignKey: 'idUser' })
Post.belongsTo(User, { foreignKey: 'idUser' })

//un usuario tiene muchos comentarios (1:n)
User.hasMany(Comment, { foreignKey: 'idUser' })
Comment.belongsTo(User, { foreignKey: 'idUser' })

//un usuario sigue a muchos usuarios
//un usuario tiene muchos seguidores (n:m)
 // Usuarios que me siguen
User.belongsToMany(User, {
    through: Follow,
    as: 'Followers',
    foreignKey: 'followingId',
    otherKey: 'followerId'
})

// Usuarios que yo sigo
User.belongsToMany(User, {
    through: Follow,
    as: 'Following',
    foreignKey: 'followerId',
    otherKey: 'followingId'
})

//un usuario tiene muchos likes( me interesa) (1:n)
User.hasMany(Like, { foreignKey: 'idUser' })
Like.belongsTo(User, { foreignKey: 'idUser' })

//un usuario tiene muchas valoraciones (1:n)
User.hasMany(Rating, { foreignKey: 'idUser' })
Rating.belongsTo(User, { foreignKey: 'idUser' })

//una imagen tiene muchos comentarios (1:n)
Image.hasMany(Comment, { foreignKey: 'idImage' })
Comment.belongsTo(Image, { foreignKey: 'idImage' })

//una publicacion tiene muchos Likes(me interesa) (1:n)
Post.hasMany(Like, { foreignKey: 'idPost' })
Like.belongsTo(Post, { foreignKey: 'idPost' })

// una imagen tiene muchas valoraciones (1:n)
Image.hasMany(Rating, { foreignKey: 'idImage' })
Rating.belongsTo(Image, { foreignKey: 'idImage' })

//una publicacion tiene muchas imagenes (1:n)
Post.hasMany(Image, { foreignKey: 'idPost' })
Image.belongsTo(Post, { foreignKey: 'idPost' })

//una publicacion tiene muchos reportes  (1:n)
Report.belongsTo(Post, { foreignKey: 'idPost' })
Post.hasMany(Report, { foreignKey: 'idPost' })

//un comentario tiene muchos reportes (1:n)
Report.belongsTo(Comment, { foreignKey: 'idComment' })
Comment.hasMany(Report, { foreignKey: 'idComment' })

//un usuario puede hacer muchos reportes (1:n)
Report.belongsTo(User, { foreignKey: 'idUser' })
User.hasMany(Report, { foreignKey: 'idUser' })

//un usuario tiene muchas collections(1:n)
User.hasMany(Collection, { foreignKey: 'idUser' })
Collection.belongsTo(User, { foreignKey: 'idUser' })

//collections tiene una relacion de (n:m) con publicacion
Collection.belongsToMany(Post, {
    through: 'SavedPosts',
    foreignKey: 'idCollection',
    otherKey: 'idPost'
})

Post.belongsToMany(Collection, {
    through: 'SavedPosts',
    foreignKey: 'idPost',
    otherKey: 'idCollection'
})

//esta relacion es de muchos a muchos
//publicaciones y hashtags (n:m)
Post.belongsToMany(Hashtag, { through: 'PostHashtags', foreignKey: 'idPost' })
Hashtag.belongsToMany(Post, { through: 'PostHashtags', foreignKey: 'idHashtag' })

// Una imagen puede recibir muchas denuncias
Image.hasMany(Report, {foreignKey: 'idImage',as: 'ImageReports'})
Report.belongsTo(Image, {foreignKey: 'idImage',as: 'ReportedImage'})

// Un comentario puede recibir muchas denuncias
Comment.hasMany(Report, {foreignKey: 'idComment',as: 'CommentReports'})
Report.belongsTo(Comment, {foreignKey: 'idComment',as: 'ReportedComment'})

// Un usuario puede realizar muchas denuncias
User.hasMany(Report, {foreignKey: 'idUser',as: 'ReportsMade'})
Report.belongsTo(User, {foreignKey: 'idUser',as: 'Reporter'})




export async function connectDatabase() {
    try {
        await sequelize.authenticate(); // testear la conexion
        console.log('[+] Conexion a bd establecida')
        await sequelize.sync({ alter: true });
        console.log('[+] Sincronizado de modelos')
    } catch (error) {
        console.error('[+] Error en la conexion a la bd', error)
        throw error
    }
}

export {
    User,
    Post,
    Image,
    Comment,
}
