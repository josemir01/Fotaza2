import { User } from "./User.js"
import { Comment } from './Comment.js'
import { Post } from "./Post.js"
import { Follow } from "./Follow.js"
import { Like } from "./Like.js"
import { Rating } from "./rating.js"
import { image } from "./image.js"
import { Report } from "./Report.js"
import { Hashtag } from "./Hashtag.js"

//un usuario tiene muchas publicaciones (1:n)
User.hasMany(Post)
Post.belongsTo(User)

//un usuario tiene muchos comentarios (1:n)
User.hasMany(Comment)
Comment.belongsTo(User)

//un usuario tiene muchos seguidores (1:n)
User.hasMany(Follow)
Follow.belongsTo(User)

//un usuario tiene muchos likes( me interesa) (1:n)
User.hasMany(Like)
Like.belongsTo(User)

//un usuario tiene muchas valoraciones (1:n)
User.hasMany(Rating)
Rating.belongsTo(User)

//una publicacion tiene muchos comentarios (1:n)
Post.hasMany(Comment)
Comment.belongsTo(Post)

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


//esta relacion es de muchos a muchos
//publicaciones y hashtags (n:n)
//Post.belongsToMany(Hashtag, { through: 'PostHashtags' })
//Hashtag.belongsToMany(Post, { through: 'PostHashtags' })

//relacion de muchos a muchos
//usuarios y publicaciones (n:n)
User.belongsToMany(Post, { through: 'SavedPosts' })
Post.belongsToMany(User, { through: 'SavedPosts' })


