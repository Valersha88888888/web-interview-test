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

export const TodoLists = () => {
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
      <Card
        sx={{
          margin: { xs: '0.5rem', sm: '1rem' },
        }}
      >
        <CardContent
          sx={{
            padding: { xs: 2, sm: 3 },
            '&:last-child': {
              paddingBottom: { xs: 2, sm: 3 },
            },
          }}
        >
          <Typography
            component='h2'
            variant='h5'
            sx={{
              marginBottom: 1,
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
            }}
          >
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
                    paddingY: { xs: 1, sm: 1.25 },
                    paddingX: { xs: 1, sm: 2 },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: { xs: 40, sm: 56 },
                    }}
                  >
                    {completed ? <CheckCircleIcon color='success' /> : <ReceiptIcon />}
                  </ListItemIcon>

                  <ListItemText
                    primary={todoList.title}
                    secondary={completed ? 'Completed' : undefined}
                    primaryTypographyProps={{
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                    }}
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