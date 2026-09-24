import React, { useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddIcon from '@mui/icons-material/Add'

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
          {todos.map((name, index) => (
            <Box
              key={index}
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

              <TextField
                fullWidth
                size='small'
                label='What to do?'
                value={name}
                placeholder='Add a todo'
                onChange={(event) => {
                  setTodos([
                    ...todos.slice(0, index),
                    event.target.value,
                    ...todos.slice(index + 1),
                  ])
                }}
              />

              <Tooltip title='Delete todo'>
                <IconButton
                  aria-label={`Delete todo ${index + 1}`}
                  onClick={() => {
                    setTodos([
                      ...todos.slice(0, index),
                      ...todos.slice(index + 1),
                    ])
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
              setTodos([...todos, ''])
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