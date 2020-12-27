const express = require('express')
const router = express.Router()
const Todo = require('../../models/todo')

router.get('/new', (req, res) => {
  return res.render('new')
})


// 更改資料庫檔案，新增todo
router.post('/', (req, res) => {
  const name = req.body.name  //從req.body拿出表單name資料
  return Todo.create({ name })      //存入資料庫
    .then(() => res.redirect('/'))  //新增完回傳首頁
    .catch(err => console.log(err))
})

// 設定detail介面的路由
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('detail', { todo }))
    .catch(err => console.log(err))
})

// 更改資料庫檔案，edit
router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, isDone } = req.body
  return Todo.findById(id)
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(err => console.log(err))
})

// 設定edit畫面的路由
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('edit', { todo }))
    .catch(err => console.log(err))
})



// 刪除資料
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router