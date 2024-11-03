import express,{Request,Response} from "express"
import dotenv from "dotenv"



dotenv.config()


const app= express()






const PORT=process.env.PORT || 9090

app.get('/',(req:Request,res:Response)=>{
    res.send(`Hello mami!`)
})
app.listen(PORT,()=>{
    console.log(`Server is listening on ${PORT}`)
})