'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material';

import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  loginSchema,
  LoginFormData,
} from '@/schemas/login.schema';

import { loginUser } from '@/services/auth.service';

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',

    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage('');

    try {
      const result = await loginUser({
        email: data.email,
        password: data.password,
      });

      localStorage.setItem(
        'access_token',
        result.access_token,
      );

      router.push('/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 401) {
          setErrorMessage(
            'Correo electrónico o contraseña incorrectos.',
          );
          return;
        }

        if (Array.isArray(message)) {
          setErrorMessage(message.join(', '));
          return;
        }

        if (typeof message === 'string') {
          setErrorMessage(message);
          return;
        }

        setErrorMessage(
          'No se pudo iniciar sesión. Inténtalo nuevamente.',
        );

        return;
      }

      setErrorMessage(
        'Ocurrió un error inesperado. Inténtalo nuevamente.',
      );
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        <TextField
          label="Correo electrónico"
          placeholder="ejemplo@correo.com"
          type="email"
          fullWidth
          autoComplete="email"
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          disabled={isSubmitting}
          {...register('email')}
        />

        <TextField
          label="Contraseña"
          placeholder="Ingresa tu contraseña"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          autoComplete="current-password"
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          disabled={isSubmitting}
          {...register('password')}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous,
                      )
                    }
                    edge="end"
                    aria-label={
                      showPassword
                        ? 'Ocultar contraseña'
                        : 'Mostrar contraseña'
                    }
                  >
                    {showPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {errorMessage && (
          <Alert severity="error">
            {errorMessage}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isSubmitting}
          sx={{
            mt: 1,
            height: 48,
          }}
        >
          {isSubmitting ? (
            <CircularProgress
              size={24}
              color="inherit"
            />
          ) : (
            'Iniciar sesión'
          )}
        </Button>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center' }}
        >
          ¿No tienes una cuenta?{' '}
          <MuiLink
            href="/register"
            underline="hover"
            sx={{ fontWeight: 600 }}
          >
            Crear cuenta
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
}