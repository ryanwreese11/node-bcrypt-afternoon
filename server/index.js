const express = require('express')
const massive = require('massive')
const session = require('express-session')
require('dotenv').config()
const app = express()

const ac = require('./controllers/authController')

app.use(express.json())

const { SESSION_SECRET, CONNECTION_STRING, SERVER_PORT } = process.env

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log('db is working')
})
app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365
    }
}))

app.post('/auth/register', ac.register)
app.post('/auth/login', ac.login)
app.get('/auth/logout', ac.logout)







app.listen(SERVER_PORT, () => {
    console.log('listening on server', SERVER_PORT)
})