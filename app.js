const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const app = express()


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

app.get('/', (res, req) => {
  req.render('index')
})

app.listen(3000, () => {
  console.log(`Server is running on localhost:3000`)
})
