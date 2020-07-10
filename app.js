const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.NODE_PORT

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => res.send('Hello World!'))

const phoneRoutes = require('./app/routes/phones.routes')
//using as middleware
app.use('/api/v1/phone', phoneRoutes)

app.listen(port, () => console.log(`Example app listening at http://localhost:1337 from the host or http://localhost:${port} from vagrant`))
