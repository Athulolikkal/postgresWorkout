import express, { application, response, urlencoded } from "express"
import cors from "cors"
import morgan from "morgan"
import axios from "axios"
const app = express()

app.use(express.json());
app.use(cors())
app.use(morgan("dev"))
app.use(urlencoded({ extended: false }))

const hasuraSecretKey = "3kMlyt0K6sia6Z0YVuVfJJjT5zHGNQ3s1a6Lvo4wmmALORAsMffTPXyyWKAuOnFN";
const hasuraEndPoint = "https://userregisterlogins.hasura.app/v1/graphql"

app.post('/adduser', async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Log the request body
        const { name, email, password } = req.body;
        console.log(name, email, password);

        const response = await axios.post(hasuraEndPoint, {
            query: `
                mutation ($name: bpchar!, $email: bpchar!, $password: bpchar!) {
                    insert_registreduser_one(object: {
                        name: $name,
                        email: $email,
                        password: $password
                    }) {
                        id
                    }
                }
            `,
            variables: {
                name,
                email,
                password
            }
        }, {
            headers: {
                "x-hasura-admin-secret": hasuraSecretKey
            }
        });

        if (response.data.errors) {
            res.status(400).json({ err: 'Email is already in use' });
        } else {
            res.status(200).json(response.data);
        }
    } catch (err) {
        console.error("Error on adduser:", err);
        res.status(500).json({ err: 'Server error' });
    }
});



app.get('/users', async (req, res) => {
    try {
        const response = await axios.post(hasuraEndPoint, {
            query: `
        query{
            registreduser{
                id,name,email
            }
        }
        `},
            {
                headers: {
                    "x-hasura-admin-secret": hasuraSecretKey
                }
            }
        )
        // console.log(response?.data?.data);
        res.json(response?.data?.data?.registreduser)
    } catch (err) {

    }
})

app.post('/isValidUser', async (req, res) => {
    try {
        const { email, password } = req?.body;
        console.log(email, password)
        const response = await axios.post(
            hasuraEndPoint,
            {
                query: `
            query GetUser($email: bpchar!) {
                registreduser(where: { email: { _eq: $email } }) {
                id,
                name,
                email,
                password
              }
            }
          `,
                variables: {
                    email,
                },
            },
            {
                headers: {
                    "x-hasura-admin-secret": hasuraSecretKey,
                },
            }
        );
        console.log(response?.data?.errors)
        const userData = response?.data?.data?.registreduser[0]
        console.log(userData);
        if (!userData) {
            res.json({ status: false })
        } else {
            const isValid = userData?.password === password
            res.json({ status: isValid ? true : false })
        }
    } catch (err) {
        console.log(err);
    }
});

app.delete('/delete', async (req, res) => {
    try {
        const { id } = req?.query
        const response = await axios.post(
            hasuraEndPoint,
            {
              query: `
                mutation DeleteUser($id: uuid!) {
                  delete_registreduser(where: { id: { _eq: $id } }) {
                    affected_rows
                  }
                }
              `,
              variables: {
                id,
              },
            },
            {
              headers: {
                "x-hasura-admin-secret": hasuraSecretKey,
              },
            }
          );
          console.log(response?.data);
          
    } catch (err) {
        console.log(err)
    }
})


app.listen(5000, () => {
    console.log("server running in port 5000")
})