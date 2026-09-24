import React, { Fragment, useState, useEffect, useCallback } from 'react'
import {
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { TodoListForm } from './TodoListForm'

const API_URL = 'http://localhost:3001'

const fetchTodoLists = async () => {
  const response = await fetch(`${API_URL}/todo-lists`)

  if (!response.ok) {
    throw new Error('Could not load todo lists')
  }

  return response.json()
}

const isTodoListCompleted = (todoList) => {
  return todoList.todos.length > 0 && todoList.todos.every((todo) => todo.completed)
}

export const TodoLists = ({ style }) => {
  const [todoLists, setTodoLists] = useState({})
  const [activeList, setActiveList] = useState()

  useEffect(() => {
    fetchTodoLists().then(setTodoLists)
  }, [])

  const saveTodoList = useCallback(async (id, { todos }) => {
    const response = await fetch(`${API_URL}/todo-lists/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ todos }),
    })

    if (!response.ok) {
      throw new Error('Could not save todo list')
    }

    const updatedTodoList = await response.json()

    setTodoLists((currentTodoLists) => ({
      ...currentTodoLists,
      [id]: updatedTodoList,
    }))
  }, [])

  if (!Object.keys(todoLists).length) return null

  return (
    <Fragment>
      <Card style={style}>
        <CardContent>
          <Typography component='h2' variant='h5' sx={{ marginBottom: 1 }}>
            My Todo Lists
          </Typography>

          <List disablePadding>
            {Object.keys(todoLists).map((key) => {
              const todoList = todoLists[key]
              const completed = isTodoListCompleted(todoList)

              return (
                <ListItemButton
                  key={key}
                  selected={activeList === key}
                  onClick={() => setActiveList(key)}
                  sx={{
                    borderRadius: 1,
                    marginBottom: 0.5,
                  }}
                >
                  <ListItemIcon>
                    {completed ? <CheckCircleIcon color='success' /> : <ReceiptIcon />}
                  </ListItemIcon>

                  <ListItemText
                    primary={todoList.title}
                    secondary={completed ? 'Completed' : undefined}
                  />
                </ListItemButton>
              )
            })}
          </List>
        </CardContent>
      </Card>

      {todoLists[activeList] && (
        <TodoListForm
          key={activeList}
          todoList={todoLists[activeList]}
          saveTodoList={saveTodoList}
        />
      )}
    </Fragment>
  )
}