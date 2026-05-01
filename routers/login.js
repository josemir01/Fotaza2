const express = require("express")
const router = express.Router()

router.post("/login",(req,res)=>{
    const {usario,password}=req.body

    //validacion de ejemplo
    const usuariovalidado=(email==="usuarioejemplo" && password==="234")

    if(usuariovalidado){
        res.redirect("/home")
    }else{
        res.redirect("/registro")
    }
})