import express from 'express'
import 'dotenv/config'
import sequelize from './db/config.js';
import UserRoute from './routers/UserRoute.js';
import PostRoute from './routers/PostRoute.js';
const app = express()

const PORT = process.env.PORT

//motor de plantillas
app.set('view engine', 'pug')
app.set('views', './views')

//middlewares
app.use(express.json)
app.use(express.urlencoded({ extended: true }))


app.use('/usuario',UserRoute)
app.use('/post',PostRoute)

//pagina de inicio
app.get("/", (req, res) => {
    res.render("home")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/buscar",(req,res)=>{
    const busqueda=req.query.termino
})

app.post("/crear-post",(req,res)=>{
    //logica al recibir los datos de la publicacion

})

app.get("/login",(req,res)=>{
    res.render("login")
})
//ruta para recibir los datos del formulario
app.post("/login",(req,res)=>{
    //logica al recibir los datos del formulario
})





//conexion a base de datos
sequelize.sync({ alter: true })
    .then(() => {
        app.listen(PORT, (err) => {
            if (err) {
                console.log("error al iniciar el servidor:", err)
                return
            }
            console.log(`servidor escuchando en ${PORT}`)
        })
    })
    .catch((err) => {
        console.log("error sincronizando con la db:", err)
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