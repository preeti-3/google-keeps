const express = require('express')
const router = require('./routes')
const compression = require('compression')
const app = express()
app.use(compression())
app.use(express.json()) // serializer 

app.use("/api/v1", router)

app.listen(3001, () => {
    console.log("server is running on port 3001")
})