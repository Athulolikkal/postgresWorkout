import express,{urlencoded} from "express"
import cors from "cors"
import morgan from "morgan"
const app=express()

app.use(express.json())
app.use(cors())
app.use(morgan("dev"))
app.use(urlencoded({extended:false}))

app.get('/',(req,res)=>{
    console.log("server is running")
})

app.listen(3000,()=>{
    console.log("server running in port 3000")
})