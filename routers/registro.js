const express = require("express")
const router = express.Router()

router.post("/registro", (req,res)=>{
    const {email,password}=req.body

    if(!email|| !password){
        return res.send("faltan datos") 
    }
    //usuario ejemplo
    const usuariocreado=true
    
    if(usuariocreado){
        res.redirect("/home")
    }else{
        res.redirect("/registro")
    }
    
})