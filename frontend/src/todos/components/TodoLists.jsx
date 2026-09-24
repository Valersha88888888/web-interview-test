import React, { useState, useEffect, useCallback } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
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
  return (
    todoList.todos.length > 0 &&
    todoList.todos.every((todo) => todo.completed)
  )
}

export const TodoLists = () => {
  const [todoLists, setTodoLists] = useState({})
  const [activeList, setActiveList] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  const loadTodoLists = useCallback(async () => {
    setIsLoading(true)
    setLoadError(false)

    try {
      const lists = await fetchTodoLists()
      setTodoLists(lists)

      const firstListId = Object.keys(lists)[0]
      setActiveList((current) => current || firstListId)
    } catch {
      setLoadError(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTodoLists()
  }, [loadTodoLists])

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

  if (isLoading) {
    return (
      <Box
        role='status'
        sx={{
          minHeight: 300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
        }}
      >
        <CircularProgress size={30} />
        <Typography color='text.secondary'>
          Loading todo lists...
        </Typography>
      </Box>
    )
  }

  if (loadError) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Alert
            severity='error'
            action={
              <Button color='inherit' size='small' onClick={loadTodoLists}>
                Retry
              </Button>
            }
          >
            Unable to load todo lists. Check that the server is running and try again.
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const lists = Object.values(todoLists)
  const allTodos = lists.flatMap((list) => list.todos)
  const completedTodos = allTodos.filter((todo) => todo.completed).length

  const progress = allTodos.length
    ? Math.round((completedTodos / allTodos.length) * 100)
    : 0

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: '230px minmax(0, 1fr)',
          lg: '270px minmax(0, 1fr)',
        },
        gap: { xs: 2, sm: 2, lg: 2.5 },
        alignItems: 'start',
      }}
    >
      <Box
        component='aside'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          minWidth: 0,
        }}
      >
        <Card
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 10px 30px rgba(28, 52, 91, 0.07)',
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography
              variant='h6'
              sx={{
                px: 1,
                mb: 1.5,
                fontWeight: 700,
              }}
            >
              My Lists
            </Typography>

            <List disablePadding>
              {lists.map((todoList) => {
                const completed = isTodoListCompleted(todoList)
                const isActive = activeList === todoList.id

                return (
                  <ListItemButton
                    key={todoList.id}
                    selected={isActive}
                    onClick={() => setActiveList(todoList.id)}
                    sx={{
                      mb: 0.75,
                      borderRadius: 2,
                      px: 1.25,
                      py: 1,
                      border: '1px solid',
                      borderColor: isActive
                        ? 'rgba(47,107,220,0.22)'
                        : 'transparent',
                      '&.Mui-selected': {
                        background:
                          'linear-gradient(90deg, rgba(47,107,220,0.12), rgba(47,107,220,0.05))',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 42 }}>
                      {completed ? (
                        <CheckCircleOutlineRoundedIcon color='success' />
                      ) : (
                        <WorkOutlineRoundedIcon
                          color={isActive ? 'primary' : 'action'}
                        />
                      )}
                    </ListItemIcon>

                    <ListItemText
                      primary={todoList.title}
                      secondary={`${todoList.todos.length} ${
                        todoList.todos.length === 1 ? 'todo' : 'todos'
                      }`}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 700 : 500,
                      }}
                    />
                  </ListItemButton>
                )
              })}
            </List>
          </CardContent>
        </Card>

        <Card
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 10px 30px rgba(28, 52, 91, 0.07)',
          }}
        >
          <CardContent>
            <Typography variant='subtitle1' sx={{ fontWeight: 700 }}>
              Progress
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
              sx={{ mt: 0.5, mb: 1.5 }}
            >
              {completedTodos} of {allTodos.length} completed
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <LinearProgress
                variant='determinate'
                value={progress}
                sx={{
                  flexGrow: 1,
                  height: 7,
                  borderRadius: 99,
                }}
              />

              <Typography variant='body2' sx={{ fontWeight: 700 }}>
                {progress}%
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box component='section' sx={{ minWidth: 0 }}>
        {todoLists[activeList] && (
          <TodoListForm
            key={activeList}
            todoList={todoLists[activeList]}
            saveTodoList={saveTodoList}
          />
        )}
      </Box>
    </Box>
  )
}