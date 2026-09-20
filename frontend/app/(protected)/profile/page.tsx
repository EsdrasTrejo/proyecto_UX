'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';
import axios from 'axios';

import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import {
  CalendarMonthOutlined,
  EmailOutlined,
  PersonOutlined,
  Refresh,
} from '@mui/icons-material';

import {
  getProfile,
  UserProfile,
} from '@/services/profile.service';

import { authStorage } from '@/services/auth-storage';

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat(
    'es-HN',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  ).format(new Date(date));
}

export default function ProfilePage() {
  const router = useRouter();

  const [
    profile,
    setProfile,
  ] = useState<UserProfile | null>(
    null,
  );

  const [loading, setLoading] =
    useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const loadProfile =
    useCallback(async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const data =
          await getProfile();

        setProfile(data);
      } catch (error) {
        console.error(
          'Error cargando perfil:',
          error,
        );

        if (
          axios.isAxiosError(error) &&
          error.response?.status === 401
        ) {
          authStorage.removeToken();

          router.replace('/login');
          return;
        }

        if (
          axios.isAxiosError(error) &&
          error.response?.status === 404
        ) {
          setErrorMessage(
            'No se encontró el perfil del usuario.',
          );

          return;
        }

        setErrorMessage(
          'No se pudo cargar tu perfil.',
        );
      } finally {
        setLoading(false);
      }
    }, [router]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadProfile();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadProfile]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 850,
        mx: 'auto',
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 700 }}
        >
          Perfil
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Información de tu cuenta.
        </Typography>
      </Box>

      {errorMessage && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<Refresh />}
              onClick={loadProfile}
            >
              Reintentar
            </Button>
          }
          sx={{ mb: 3 }}
        >
          {errorMessage}
        </Alert>
      )}

      {profile && (
        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              p: {
                xs: 3,
                sm: 4,
              },

              display: 'flex',
              flexDirection: {
                xs: 'column',
                sm: 'row',
              },

              alignItems: {
                xs: 'flex-start',
                sm: 'center',
              },

              gap: 3,
            }}
          >
            <Avatar
              sx={{
                width: 82,
                height: 82,
                bgcolor: 'primary.main',
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              {getInitials(
                profile.name,
              )}
            </Avatar>

            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700 }}
              >
                {profile.name}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {profile.email}
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Stack
            spacing={0}
            sx={{
              p: {
                xs: 2,
                sm: 3,
              },
            }}
          >
            <ProfileRow
              icon={<PersonOutlined />}
              label="Nombre"
              value={profile.name}
            />

            <Divider />

            <ProfileRow
              icon={<EmailOutlined />}
              label="Correo electrónico"
              value={profile.email}
            />

            <Divider />

            <ProfileRow
              icon={
                <CalendarMonthOutlined />
              }
              label="Miembro desde"
              value={formatDate(
                profile.createdAt,
              )}
            />
          </Stack>
        </Paper>
      )}
    </Box>
  );
}

interface ProfileRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function ProfileRow({
  icon,
  label,
  value,
}: ProfileRowProps) {
  return (
    <Stack
      direction={{
        xs: 'column',
        sm: 'row',
      }}
      spacing={{
        xs: 1,
        sm: 3,
      }}
      sx={{
        py: 2,
        alignItems: {
          xs: 'flex-start',
          sm: 'center',
        },
      }}
    >
      <Box
        sx={{
          color: 'primary.main',
          display: 'flex',
        }}
      >
        {icon}
      </Box>

      <Box
        sx={{
          flexGrow: 1,
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
        >
          {label}
        </Typography>

        <Typography
          sx={{
            mt: 0.25,
            fontWeight: 600,
            wordBreak: 'break-word',
          }}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}