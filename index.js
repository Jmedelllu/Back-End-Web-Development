const express = require('express')
const app = express()
const morgan = require('morgan')
const path = require('path')    
const multer = require('multer')
const fs = require('fs')
const upload = multer({ dest: 'public/'})
const cors = require('cors')

const hostname = '127.0.0.1'
const port = 3000

app.use(morgan('combined'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static(path.join(__dirname, "public")))

//static file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

//body parser
app.post('/login', (req, res) => {
    const {username, password} = req.body
    res.send(`Anda login dengan username ${username} dan password ${password}`)
})

//upload file
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file
    if(file){
        const target = path.join(__dirname, 'public', file.originalname)
        fs.renameSync(file.path, target)
        res.send("file berhasil diupload")
    }else{
        res.send("file gagal diupload")
    }
})

app.use(cors())

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})