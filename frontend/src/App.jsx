import React from 'react'
import {
  AppBar,
  Avatar,
  Box,
  Container,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { TodoLists } from './todos/components/TodoLists'

const App = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #f4f7fc 0%, #eef3fb 50%, #f8f9fc 100%)',
      }}
    >
      <AppBar
        position='sticky'
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #2f6bdc 0%, #5a82d6 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.16)',
        }}
      >
        <Container maxWidth='xl'>
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 64, sm: 72 },
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                backgroundColor: 'white',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
                boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
              }}
            >
              <CheckRoundedIcon color='primary' />
            </Box>

            <Typography
              component='h1'
              variant='h5'
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.02em',
                flexGrow: 1,
                whiteSpace: 'nowrap',
              }}
            >
              Things to do
            </Typography>

            <TextField
              size='small'
              placeholder='Search todos...'
              aria-label='Search todos'
              sx={{
                display: { xs: 'none', md: 'block' },
                width: 280,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  borderRadius: 3,
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.18)',
                  },
                },
                '& input::placeholder': {
                  color: 'rgba(255,255,255,0.8)',
                  opacity: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchRoundedIcon sx={{ color: 'white' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'white',
                color: 'primary.main',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              T
            </Avatar>
          </Toolbar>
        </Container>
      </AppBar>

      <Container
        component='main'
        maxWidth='xl'
        sx={{
          py: { xs: 2, sm: 3 },
          px: { xs: 1.5, sm: 3 },
        }}
      >
        <TodoLists />
      </Container>
    </Box>
  )
}

export default App