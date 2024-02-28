const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const hostname = '127.0.0.1'
const port = 3000

app.use(morgan('dev'));
app.use(cors({ origin: 'http://127.0.0.1:5500' }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// GET: /users endpoint ini bertugas untuk memberikan list data users
app.get('/users', (req, res) => {
    res.json(users);
});

// GET: /users/:name endpoint ini bertugas memberikan data user sesuai dengan permintaan client.
app.get('/users/:name', (req, res) => {
    const name = req.params.name.toLowerCase();
    const user = users.find(u => u.name.toLowerCase() === name);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ status: 'error', message: 'resource tidak ditemukan' });
    }
});

// POST: /users endpoint ini bertugas untuk menambahkan record baru.
app.post('/users', (req, res) => {
    const { name, age } = req.body;
    if (!name || !age) {
        res.status(400).json({ status: 'error', message: 'Name and age are required' });
    } else {
        users.push({ name, age });
        res.status(201).json({ success: true });
    }
});

// POST: /upload endpoint ini bertugas untuk menerima request berupa file gambar
app.post('/upload', (req, res) => {
    const image = req.body.image;
    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    const filename = `image_${Date.now()}.png`;

    fs.writeFile(path.join(__dirname, 'public', filename), base64Data, 'base64', (err) => {
        if (err) {
            res.status(500).json({ status: 'error', message: 'Failed to upload image' });
        } else {
            res.status(201).json({ success: true });
        }
    });
});

// PUT: /users/:name endpoint ini bertugas untuk melakukan edit pada data yang dipilih melalui parameter :name.
app.put('/users/:name', (req, res) => {
    const name = req.params.name.toLowerCase();
    const userIndex = users.findIndex(u => u.name.toLowerCase() === name);
    if (userIndex !== -1) {
        const { age } = req.body;
        if (!age) {
            res.status(400).json({ status: 'error', message: 'Age is required' });
        } else {
            users[userIndex].age = age;
            res.json({ success: true });
        }
    } else {
        res.status(404).json({ status: 'error', message: 'User not found' });
    }
});

// DELETE: /users/:name endpoint ini bertugas untuk menghapus data dengan parameter :name
app.delete('/users/:name', (req, res) => {
    const name = req.params.name.toLowerCase();
    const userIndex = users.findIndex(u => u.name.toLowerCase() === name);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.json({ success: true });
    } else {
        res.status(404).json({ status: 'error', message: 'User not found' });
    }
});

// 404 route handler
app.use((req, res, next) => {
    res.status(404).json({ status: 'error', message: 'resource tidak ditemukan' });
});

// error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: 'error', message: 'terjadi kesalahan pada server' });
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})