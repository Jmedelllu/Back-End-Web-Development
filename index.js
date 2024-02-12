const http = require('http');
const moment = require('moment');
const members = require('./members');
const getUsers = require('./users');
const express = require('express');
const app = express();
const morgan = require('morgan');
const hostname = '127.0.0.1';
const port = 3000;

app.use(morgan('combined'));

app.get('/', (req, res) => {res.send("This is the home page")});

app.get('/about', (req, res) => {res.send(JSON.stringify({
    'status': 'success',
    'message': 'response success',
    'description': 'Exercise #03',
    date: moment().format(),
    data: JSON.stringify(members)
}))});

app.get('/users', async (req, res) => {
    const usersData = await getUsers();
    res.send(JSON.stringify(usersData));
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
