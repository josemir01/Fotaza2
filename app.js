import express from 'express'
import 'dotenv/config'
import sequelize from './db/config.js';
import router from './routers/UserRoute.js';
const app = express()

const PORT = process.env.PORT

//motor de plantillas
app.set('view engine', 'pug')
app.set('views', './views')

//middlewares
app.use(express.json)
app.use(express.urlencoded({ extended: true }))


app.use('/usuario',UserRoute)

app.use('/gastos', gastosRouter);

//pagina de inicio
app.get("/", (req, res) => {
    res.render("home")
})

app.get("/login", (req, res) => {
    res.render("login")
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