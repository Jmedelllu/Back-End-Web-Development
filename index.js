const http = require('http')
const express = require('express')
const getUsers = require('./users')
const app = express()
const morgan = require('morgan')
const hostname = '127.0.0.1'
const port = 3000

app.use(morgan('combined'))

app.get('/', (req, res) => {
    res.send("This is the home page")
})

app.get('/users', (req, res) => {
    res.json(getUsers)
})

app.get('/users/:name', (req, res) => {
    const user = getUsers.find(user => user.name === req.params.name)
    if (user) {
        res.json(user)
    } else {
        res.status(404).json({
            message: "Data user tidak ditemukan"
        })
    }
})

app.use((req, res, next) => {
    res.status(404).json({
        status: "Error",
        message: "Resource tidak ditemukan",
    })
    next()
})

const errorHandling = (err, req, res, next) => {
    res.status(500).json({
        status: "Error",
        message: "terjadi kesalahan pada server",
    })
}

app.use(errorHandling)

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})