import express from 'express'
import 'dotenv/config'
import sequelize from './db/config.js';
import UserRoute from './routers/UserRoute.js';
import PostRoute from './routers/PostRoute.js';
import './models/index.js'
import { connectDatabase } from './models/index.js'
import session from 'express-session'
const app = express()

const PORT = process.env.PORT

//motor de plantillas
app.set('view engine', 'pug')
app.set('views', './views')

//middlewares
app.use(express.json({limit:'10mb'}))
app.use(express.urlencoded({ extended: true,limit:'10mb' }))
app.use(express.static('public'))

//sesion
app.use(session({
  secret: 'mi_secreto',
  resave: false,
  saveUninitialized: false
}))

//dejar para luego cuando tenga que implementar el login 

// app.use((req, res, next) => {
//     res.locals.user = req.session.user || null
//     next()
// })

app.get('/profile', (req, res) => {
    const userId = 1
    res.redirect(`/usuario/${userId}`)
})

//Rutas
app.use('/usuario',UserRoute)
app.use('/post',PostRoute)

//pagina de inicio
app.get("/", (req, res) => {
    res.render("home")
})
app.get('/login', (req, res) => {
  res.render('login')
})
// app.get("/login", (req, res) => {
//     res.render("login")
// })

// app.get("/buscar",(req,res)=>{
//     res.render()
//     const busqueda=req.query.termino
// })

// app.post("/crear-post",(req,res)=>{
//     //logica al recibir los datos de la publicacion

// })

// app.get("/login",(req,res)=>{
//     res.render("login")
// })
// //ruta para recibir los datos del formulario
// app.post("/login",(req,res)=>{
//     //logica al recibir los datos del formulario
// })


// CONEXION A BD
connectDatabase()
    .then(() => {
        app.listen(PORT, (err) => {
            if (err) {
                console.error('[+] Error al iniciar el servidor:', err);
                return;
            }
            console.log(`[+] Servidor escuchando en el puerto ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('[+] Error sincronizando con bd:', err)
    })


//inicio del servidor
//app.listen(PORT ,()=>{
//  console.log(`servidor corriendo en ${PORT}`)
//})