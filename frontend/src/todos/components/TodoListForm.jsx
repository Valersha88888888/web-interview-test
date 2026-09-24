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
  dueDate: null,
})

const getDueDateStatus = (todo) => {
  if (todo.completed) return 'Completed'
  if (!todo.dueDate) return ''

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueDate = new Date(`${todo.dueDate}T00:00:00`)
  const differenceInMs = dueDate.getTime() - today.getTime()
  const differenceInDays = Math.round(differenceInMs / 86400000)

  if (differenceInDays === 0) return 'Due today'

  if (differenceInDays > 0) {
    return `Due in ${differenceInDays} day${differenceInDays === 1 ? '' : 's'}`
  }

  const overdueDays = Math.abs(differenceInDays)

  return `Overdue by ${overdueDays} day${overdueDays === 1 ? '' : 's'}`
}

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
    <Card sx={{ margin: { xs: '0 0.5rem', sm: '0 1rem' } }}>
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
            marginBottom: 2,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          }}
        >
          {todoList.title}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {todos.map((todo, index) => {
            const dueDateStatus = getDueDateStatus(todo)

            return (
              <Box
                key={todo.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '32px minmax(0, 1fr) 40px',
                    sm: '32px minmax(0, 1fr) 160px 40px',
                    md: '24px 42px minmax(0, 1fr) 170px 40px',
                  },
                  gridTemplateAreas: {
                    xs: `
                      "check text delete"
                      ". date ."
                    `,
                    sm: `
                      "check text date delete"
                    `,
                    md: `
                      "number check text date delete"
                    `,
                  },
                  alignItems: 'start',
                  gap: 1,
                }}
              >
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{
                    gridArea: 'number',
                    display: { xs: 'none', md: 'block' },
                    textAlign: 'center',
                    paddingTop: 1.25,
                  }}
                >
                  {index + 1}
                </Typography>

                <Checkbox
                  sx={{
                    gridArea: 'check',
                    alignSelf: 'center',
                  }}
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
                  sx={{
                    gridArea: 'text',
                    '& .MuiInputBase-input': {
                      textDecoration: todo.completed ? 'line-through' : 'none',
                    },
                  }}
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
                />

                <Box
                  sx={{
                    gridArea: 'date',
                    minWidth: 0,
                  }}
                >
                  <TextField
                    fullWidth
                    size='small'
                    type='date'
                    label='Due date'
                    value={todo.dueDate || ''}
                    InputLabelProps={{ shrink: true }}
                    onChange={(event) => {
                      setTodos(
                        todos.map((item) =>
                          item.id === todo.id
                            ? { ...item, dueDate: event.target.value || null }
                            : item
                        )
                      )
                    }}
                  />

                  {dueDateStatus && (
                    <Typography
                      variant='caption'
                      color={
                        !todo.completed && dueDateStatus.startsWith('Overdue')
                          ? 'error'
                          : 'text.secondary'
                      }
                      sx={{
                        display: 'block',
                        marginTop: 0.5,
                      }}
                    >
                      {dueDateStatus}
                    </Typography>
                  )}
                </Box>

                <Tooltip title='Delete todo'>
                  <IconButton
                    sx={{
                      gridArea: 'delete',
                      justifySelf: 'center',
                    }}
                    aria-label={`Delete todo ${index + 1}`}
                    onClick={() => {
                      setTodos(todos.filter((item) => item.id !== todo.id))
                    }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )
          })}
        </Box>

        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 1.5,
          }}
        >
          <Button
            type='button'
            startIcon={<AddIcon />}
            sx={{
              alignSelf: { xs: 'flex-start', sm: 'auto' },
            }}
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
            sx={{
              minHeight: '1.5rem',
              textAlign: { xs: 'left', sm: 'right' },
            }}
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