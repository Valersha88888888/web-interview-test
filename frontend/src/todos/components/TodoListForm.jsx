import React, { useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddIcon from '@mui/icons-material/Add'

const createTodo = () => ({
  id: `todo-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  text: '',
  completed: false,
})

export const TodoListForm = ({ todoList, saveTodoList }) => {
  const [todos, setTodos] = useState(todoList.todos)
  const [saveStatus, setSaveStatus] = useState('idle')
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    setSaveStatus('saving')

    const timeout = setTimeout(async () => {
      try {
        await saveTodoList(todoList.id, { todos })
        setSaveStatus('saved')
      } catch {
        setSaveStatus('error')
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [todos, todoList.id, saveTodoList])

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent sx={{ padding: 3, '&:last-child': { paddingBottom: 3 } }}>
        <Typography component='h2' variant='h5' sx={{ marginBottom: 2 }}>
          {todoList.title}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {todos.map((todo, index) => (
            <Box
              key={todo.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography
                variant='body2'
                color='text.secondary'
                sx={{
                  width: 24,
                  flexShrink: 0,
                  textAlign: 'center',
                }}
              >
                {index + 1}
              </Typography>

              <Checkbox
                checked={todo.completed}
                onChange={(event) => {
                  setTodos(
                    todos.map((item) =>
                      item.id === todo.id
                        ? { ...item, completed: event.target.checked }
                        : item
                    )
                  )
                }}
                inputProps={{
                  'aria-label': `Mark todo ${index + 1} as completed`,
                }}
              />

              <TextField
                fullWidth
                size='small'
                label='What to do?'
                value={todo.text}
                placeholder='Add a todo'
                onChange={(event) => {
                  setTodos(
                    todos.map((item) =>
                      item.id === todo.id
                        ? { ...item, text: event.target.value }
                        : item
                    )
                  )
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    textDecoration: todo.completed ? 'line-through' : 'none',
                  },
                }}
              />

              <Tooltip title='Delete todo'>
                <IconButton
                  aria-label={`Delete todo ${index + 1}`}
                  onClick={() => {
                    setTodos(todos.filter((item) => item.id !== todo.id))
                  }}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Button
            type='button'
            startIcon={<AddIcon />}
            onClick={() => {
              setTodos([...todos, createTodo()])
            }}
          >
            Add todo
          </Button>

          <Typography
            variant='body2'
            color={saveStatus === 'error' ? 'error' : 'text.secondary'}
            role='status'
          >
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'saved' && '✓ Saved'}
            {saveStatus === 'error' && 'Could not save'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}