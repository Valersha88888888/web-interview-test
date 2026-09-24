import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const todoLists = {
  '0000000001': {
    id: '0000000001',
    title: 'First List',
    todos: [
      {
        id: 'todo-1',
        text: 'First todo of first list!',
        completed: false,
      },
    ],
  },
  '0000000002': {
    id: '0000000002',
    title: 'Second List',
    todos: [
      {
        id: 'todo-2',
        text: 'First todo of second list!',
        completed: false,
      },
    ],
  },
}

app.get('/todo-lists', (req, res) => {
  res.json(todoLists)
})

app.put('/todo-lists/:id', (req, res) => {
  const { id } = req.params
  const todoList = todoLists[id]

  if (!todoList) {
    return res.status(404).json({ message: 'Todo list not found' })
  }

  const { todos } = req.body

  if (!Array.isArray(todos)) {
    return res.status(400).json({ message: 'Todos must be an array' })
  }

  todoLists[id] = {
    ...todoList,
    todos,
  }

  return res.json(todoLists[id])
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})