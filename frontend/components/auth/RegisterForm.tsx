'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  Snackbar,
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
  registerSchema,
  RegisterFormData,
} from '@/schemas/register.schema';

import { registerUser } from '@/services/auth.service';

export default function RegisterForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',

    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      setSuccessMessage('Cuenta creada correctamente');

      setTimeout(() => {
        router.push('/login');
      }, 1200);
    } catch (error) {
      console.error('Error al registrar usuario:', error);

      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
          setErrorMessage(message.join(', '));
        } else if (typeof message === 'string') {
          setErrorMessage(message);
        } else {
          setErrorMessage(
            'No se pudo crear la cuenta. Inténtalo nuevamente.',
          );
        }
      } else {
        setErrorMessage(
          'Ocurrió un error inesperado. Inténtalo nuevamente.',
        );
      }
    }
  };

  return (
    <>
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
            label="Nombre completo"
            placeholder="Ej. Juan Pérez"
            fullWidth
            autoComplete="name"
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            disabled={isSubmitting}
            {...register('name')}
          />

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
            placeholder="Mínimo 6 caracteres"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            autoComplete="new-password"
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
                        setShowPassword((previous) => !previous)
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

          <TextField
            label="Confirmar contraseña"
            placeholder="Repite tu contraseña"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            autoComplete="new-password"
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword?.message}
            disabled={isSubmitting}
            {...register('confirmPassword')}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(
                          (previous) => !previous,
                        )
                      }
                      edge="end"
                      aria-label={
                        showConfirmPassword
                          ? 'Ocultar contraseña'
                          : 'Mostrar contraseña'
                      }
                    >
                      {showConfirmPassword ? (
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
              'Crear cuenta'
            )}
          </Button>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            ¿Ya tienes una cuenta?{' '}
            <MuiLink
              component={Link}
              href="/login"
              underline="hover"
              sx={{ fontWeight: 600 }}
            >
              Iniciar sesión
            </MuiLink>
          </Typography>
        </Box>
      </Box>

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={2000}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
}