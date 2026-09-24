import React, { useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import AddRoundedIcon from '@mui/icons-material/AddRounded'

const createTodo = (text = '', dueDate = null) => ({
  id: `todo-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  text,
  completed: false,
  dueDate,
})

const getDueDateStatus = (todo) => {
  if (todo.completed) {
    return {
      label: 'Completed',
      color: 'success',
    }
  }

  if (!todo.dueDate) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueDate = new Date(`${todo.dueDate}T00:00:00`)
  const differenceInDays = Math.round(
    (dueDate.getTime() - today.getTime()) / 86400000
  )

  if (differenceInDays === 0) {
    return {
      label: 'Due today',
      color: 'warning',
    }
  }

  if (differenceInDays > 0) {
    return {
      label: `Due in ${differenceInDays} day${differenceInDays === 1 ? '' : 's'}`,
      color: 'primary',
    }
  }

  const overdueDays = Math.abs(differenceInDays)

  return {
    label: `Overdue by ${overdueDays} day${overdueDays === 1 ? '' : 's'}`,
    color: 'error',
  }
}

export const TodoListForm = ({ todoList, saveTodoList }) => {
  const [todos, setTodos] = useState(todoList.todos)
  const [saveStatus, setSaveStatus] = useState('idle')
  const [newTodoText, setNewTodoText] = useState('')
  const [newTodoDate, setNewTodoDate] = useState('')
  const [editingTodoId, setEditingTodoId] = useState(null)
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

  const completedCount = todos.filter((todo) => todo.completed).length

  const handleAddTodo = () => {
    const trimmedText = newTodoText.trim()

    if (!trimmedText) return

    setTodos([
      ...todos,
      createTodo(trimmedText, newTodoDate || null),
    ])

    setNewTodoText('')
    setNewTodoDate('')
  }

  return (
    <Card
      sx={{
        overflow: 'hidden',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 14px 38px rgba(28, 52, 91, 0.09)',
      }}
    >
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 2.25, sm: 2.75 },
          color: 'white',
          background:
            'linear-gradient(135deg, #355fa9 0%, #5d7fbd 55%, #8298c3 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.14)',
            }}
          >
            <WorkOutlineRoundedIcon />
          </Box>

          <Box>
            <Typography component='h2' variant='h5' sx={{ fontWeight: 700 }}>
              {todoList.title}
            </Typography>

            <Typography
              variant='body2'
              sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.25 }}
            >
              {todos.length} {todos.length === 1 ? 'todo' : 'todos'} ·{' '}
              {completedCount} completed
            </Typography>
          </Box>
        </Box>

        <Typography
          variant='body2'
          role='status'
          aria-live='polite'
          sx={{
            textAlign: 'right',
            color:
              saveStatus === 'error'
                ? '#ffd2d2'
                : 'rgba(255,255,255,0.85)',
          }}
        >
          {saveStatus === 'saving' && 'Saving...'}
          {saveStatus === 'saved' && 'Saved'}
          {saveStatus === 'error' && 'Could not save'}
        </Typography>
      </Box>

      <Box
        sx={{
          p: { xs: 1.5, sm: 2.5 },
          backgroundColor: '#f8faff',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'minmax(0, 1fr) 175px auto',
            },
            gap: 1,
            mb: 2,
            p: 1.25,
            borderRadius: 2.5,
            backgroundColor: 'white',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <TextField
            size='small'
            placeholder='Add a new todo...'
            value={newTodoText}
            onChange={(event) => setNewTodoText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleAddTodo()
              }
            }}
          />

          <TextField
            size='small'
            type='date'
            value={newTodoDate}
            inputProps={{
              'aria-label': 'Due date for new todo',
            }}
            onChange={(event) => setNewTodoDate(event.target.value)}
          />

          <Button
            variant='contained'
            startIcon={<AddRoundedIcon />}
            disabled={!newTodoText.trim()}
            onClick={handleAddTodo}
            sx={{
              borderRadius: 2,
              px: 2,
              boxShadow: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Add todo
          </Button>
        </Box>

        {todos.length === 0 ? (
          <Box
            sx={{
              py: 6,
              px: 2,
              textAlign: 'center',
              backgroundColor: 'white',
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 2.5,
            }}
          >
            <Typography sx={{ fontWeight: 700 }}>
              No todos yet
            </Typography>

            <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
              Add your first todo to get started.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {todos.map((todo, index) => {
              const status = getDueDateStatus(todo)
              const isEditing = editingTodoId === todo.id

              return (
                <Box
                  key={todo.id}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '40px minmax(0, 1fr) 40px 40px',
                      md: '40px minmax(160px, 1fr) 165px minmax(105px, auto) 40px 40px',
                    },
                    gridTemplateAreas: {
                      xs: `
                        "check text edit delete"
                        ". date date ."
                        ". status status ."
                      `,
                      md: '"check text date status edit delete"',
                    },
                    alignItems: 'center',
                    gap: 0.75,
                    p: { xs: 1, sm: 1.25 },
                    backgroundColor: 'white',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2.25,
                    transition:
                      'box-shadow 160ms ease, border-color 160ms ease',
                    '&:hover': {
                      borderColor: 'rgba(47,107,220,0.24)',
                      boxShadow: '0 7px 20px rgba(28,52,91,0.06)',
                    },
                  }}
                >
                  <Checkbox
                    sx={{ gridArea: 'check' }}
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
                    variant='standard'
                    value={todo.text}
                    placeholder='What to do?'
                    focused={isEditing}
                    InputProps={{
                      disableUnderline: !isEditing,
                      readOnly: !isEditing,
                    }}
                    sx={{
                      gridArea: 'text',
                      '& .MuiInputBase-input': {
                        fontWeight: 500,
                        textDecoration: todo.completed
                          ? 'line-through'
                          : 'none',
                        color: todo.completed
                          ? 'text.secondary'
                          : 'text.primary',
                      },
                    }}
                    onChange={(event) => {
                      setTodos(
                        todos.map((item) =>
                          item.id === todo.id
                            ? { ...item, text: event.target.value }
                            : item
                        )
                      )
                    }}
                    onBlur={() => setEditingTodoId(null)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        setEditingTodoId(null)
                        event.currentTarget.blur()
                      }
                    }}
                  />

                  <TextField
                    size='small'
                    type='date'
                    value={todo.dueDate || ''}
                    inputProps={{
                      'aria-label': `Due date for todo ${index + 1}`,
                    }}
                    sx={{
                      gridArea: 'date',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fafbfe',
                      },
                    }}
                    onChange={(event) => {
                      setTodos(
                        todos.map((item) =>
                          item.id === todo.id
                            ? {
                                ...item,
                                dueDate: event.target.value || null,
                              }
                            : item
                        )
                      )
                    }}
                  />

                  <Box sx={{ gridArea: 'status' }}>
                    {status && (
                      <Chip
                        size='small'
                        label={status.label}
                        color={status.color}
                        variant={
                          status.color === 'primary'
                            ? 'outlined'
                            : 'filled'
                        }
                        sx={{
                          maxWidth: '100%',
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>

                  <Tooltip title='Edit todo'>
                    <IconButton
                      sx={{ gridArea: 'edit' }}
                      color={isEditing ? 'primary' : 'default'}
                      aria-label={`Edit todo ${index + 1}`}
                      onClick={() => setEditingTodoId(todo.id)}
                    >
                      <EditOutlinedIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title='Delete todo'>
                    <IconButton
                      sx={{ gridArea: 'delete' }}
                      aria-label={`Delete todo ${index + 1}`}
                      onClick={() => {
                        setTodos(
                          todos.filter((item) => item.id !== todo.id)
                        )
                      }}
                    >
                      <DeleteOutlineRoundedIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                </Box>
              )
            })}
          </Box>
        )}
      </Box>
    </Card>
  )
}