import express, { response, urlencoded } from "express"
import cors from "cors"
import morgan from "morgan"
import axios from "axios"
const app = express()

app.use(express.json()); 
app.use(cors())
app.use(morgan("dev"))
app.use(urlencoded({ extended: false }))

const hasuraSecretKey = "OheVoTtC4yG7CtpAwKt9nWfrc4OrjjCvapRvYEhrmQvufbe3e0j1uj7vczKSqrNn";
const hasuraEndPoint = "https://evident-mantis-26.hasura.app/v1/graphql"

app.post('/adduser', async (req, res) => {
    try {
        console.log('Request Body:', req?.body); // Log the request body
        const { name, age } = req?.body;
        console.log(name, age);

        const response = await axios.post(hasuraEndPoint, {
            query: `
            mutation ($name: bpchar!, $age: Int!) {
                insert_users_one(object: {
                  name: $name,
                  age: $age
                }) {
                  id 
                }
              }
              
            `,
            variables: {
                name,
                age
            }
        },
        {
            headers: {
                "x-hasura-admin-secret": hasuraSecretKey
            }
        });

        console.log(response?.data); 
    } catch (err) {
       
        console.error("Error on adduser:", err);
        
    }
});


app.get('/',async(req,res)=>{
    try{
     const response= await axios.post(hasuraEndPoint,{
        query: `
        query{
            users{
                id,name,age
            }
        }
        `},
        {
            headers:{
                "x-hasura-admin-secret": hasuraSecretKey
            }
        }
        )
        console.log(response?.data?.data?.users);
        res.json(response?.data?.data?.users)
    }catch(err){

    }
})

app.listen(3000, () => {
    console.log("server running in port 3000")
})