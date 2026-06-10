import express from 'express'
import 'dotenv/config'
import sequelize from './db/config.js';
import UserRoute from './routers/UserRoute.js';
import PostRoute from './routers/PostRoute.js';
import AuthRoute from './routers/AuthRoute.js'
import './models/index.js'
import { connectDatabase } from './models/index.js'
import session from 'express-session'
const app = express()

const PORT = process.env.PORT

//motor de plantillas
app.set('view engine', 'pug')
app.set('views', './views')

//middlewares
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(express.static('public'))

//sesion
app.use(session({
    secret: 'Session_key',
    resave: false,
    saveUninitialized: false
}))

app.use((req, res, next) => {
    res.locals.user = req.session.user || null
    next()
})

app.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login')
    }
    res.redirect(`/usuario/${req.session.user.userid}`)
})

//Rutas
app.use('/', AuthRoute)
app.use('/usuario', UserRoute)
app.use('/post', PostRoute)

//pagina de inicio
app.get("/", (req, res) => {
    res.render("home")
})
app.get('/login', (req, res) => {
    res.render('login')
})


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