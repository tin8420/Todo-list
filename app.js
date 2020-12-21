const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const app = express()
const Todo = require('./models/todo')

mongoose.connect('mongodb://localhost/todo-list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected')
})

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
  Todo.find()
    .lean()
    .then(todos => res.render('index', { todos }))
    .catch(err => console.err(err))
})

app.listen(3000, () => {
  console.log(`Server is running on localhost:3000`)
})
