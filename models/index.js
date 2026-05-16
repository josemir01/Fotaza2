import { User } from "./User.js"
import { Comment } from './Comment.js'
import { Post } from "./Post.js"
import { Follow } from "./Follow.js"
import { Like } from "./Like.js"
import { Rating } from "./rating.js"
import { image } from "./image.js"
import { Report } from "./Report.js"
import { Hashtag } from "./Hashtag.js"
import { Collection } from "./Collection.js"

//un usuario tiene muchas publicaciones (1:n)
User.hasMany(Post)
Post.belongsTo(User)


//un usuario tiene muchos comentarios (1:n)
User.hasMany(Comment)
Comment.belongsTo(User)

//un usuario sigue a muchos usuarios
//un usuario tiene muchos seguidores (n:m)
User.belongsToMany(User, {
    through: Follow,
    as: 'Followers',
    foreignKey: 'followingId'
})

User.belongsToMany(User, {
    through: Follow,
    as: 'Following',
    foreignKey: 'followerId'
})

//un usuario tiene muchos likes( me interesa) (1:n)
User.hasMany(Like)
Like.belongsTo(User)

//un usuario tiene muchas valoraciones (1:n)
User.hasMany(Rating)
Rating.belongsTo(User)

//una imagen tiene muchos comentarios (1:n)
Image.hasMany(Comment)
Comment.belongsTo(image)

//una publicacion tiene muchos Likes(me interesa) (1:n)
Post.hasMany(Like)
Like.belongsTo(Post)

//una publicacion tiene muchas Valoraciones (1:n)
Post.hasMany(Rating)
Rating.belongsTo(Post)

//una publicacion tiene muchas imagenes (1:n)
Post.hasMany(Image)
image.belongsTo(Post)

//una publicacion tiene muchos reportes  (1:n)
Report.belongsTo(Post)
Post.hasMany(Report)

//un comentario tiene muchos reportes (1:n)
Report.belongsTo(Comment)
Comment.hasMany(Report)

//un usuario puede hacer muchos reportes (1:n)
Report.belongsTo(User)
User.hasMany(Report)

//un usuario tiene muchas collections(1:n)
User.hasMany(Collection)
Collection.belongsTo(User)

//collections tiene una relacion de (n:m) con publicacion
Collection.belongsToMany(Post,{through: 'SavedPosts'})
Post.belongsToMany(Collection,{through: 'SavedPosts'})

//esta relacion es de muchos a muchos
//publicaciones y hashtags (n:m)
Post.belongsToMany(Hashtag, { through: 'PostHashtags' })
Hashtag.belongsToMany(Post, { through: 'PostHashtags' })

//usuario y publicacion (1:n)
User.hasMany(Post)
Post.belongsTo(User)

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
