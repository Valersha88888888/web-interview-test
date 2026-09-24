import React, { useEffect, useRef, useState } from 'react'
import {
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
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
      <CardContent>
        <Typography component='h2'>{todoList.title}</Typography>

        {todos.map((name, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ margin: '8px' }} variant='h6'>
              {index + 1}
            </Typography>

            <TextField
              sx={{ flexGrow: 1, marginTop: '1rem' }}
              label='What to do?'
              value={name}
              onChange={(event) => {
                setTodos([
                  ...todos.slice(0, index),
                  event.target.value,
                  ...todos.slice(index + 1),
                ])
              }}
            />

            <Button
              sx={{ margin: '8px' }}
              size='small'
              color='secondary'
              aria-label={`Delete todo ${index + 1}`}
              onClick={() => {
                setTodos([
                  ...todos.slice(0, index),
                  ...todos.slice(index + 1),
                ])
              }}
            >
              <DeleteIcon />
            </Button>
          </div>
        ))}

        <CardActions
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            type='button'
            color='primary'
            onClick={() => {
              setTodos([...todos, ''])
            }}
          >
            Add Todo <AddIcon />
          </Button>

          <Typography
            variant='body2'
            color={saveStatus === 'error' ? 'error' : 'text.secondary'}
          >
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'saved' && 'Saved'}
            {saveStatus === 'error' && 'Could not save'}
          </Typography>
        </CardActions>
      </CardContent>
    </Card>
  )
}