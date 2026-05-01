import express from 'express'

const app=express()

//motor de plantillas
app.set('view engine','pug')
app.set('views','./views')

//middlewares
app.use(express.json)
app.use(express.urlencoded({extended:true}))


//pagina de inicio
app.get("/",(req,res)=>{
res.send("bienvenido")
})



//inicio del servidor
app.listen(PORT ,()=>{
    console.log(`servidor corriendo en ${PORT}`)
})