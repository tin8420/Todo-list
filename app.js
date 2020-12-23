const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
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

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/todos/new', (req, res) => {
  return res.render('new')
})

// 顯示首頁
app.get('/', (req, res) => {
  Todo.find()
    .lean()
    .then(todos => res.render('index', { todos }))
    .catch(err => console.err(err))
})

// 設定detail介面的路由
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('detail', { todo }))
    .catch(err => console.log(err))
})

// 更改資料庫檔案，edit
app.post('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  return Todo.findById(id)
    .then(todo => {
      todo.name = name
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(err => console.log(err))
})

// 設定edit畫面的路由
app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('edit', { todo }))
    .catch(err => console.log(err))
})


// 更改資料庫檔案，新增todo
app.post('/todos', (req, res) => {
  const name = req.body.name  //從req.body拿出表單name資料
  return Todo.create({ name })      //存入資料庫
    .then(() => res.redirect('/'))  //新增完回傳首頁
    .catch(err => console.log(err))
})

// 刪除資料
app.post('/todos/:id/delete', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

app.listen(3000, () => {
  console.log(`Server is running on localhost:3000`)
})
