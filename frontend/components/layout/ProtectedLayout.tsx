'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
  AppBar,
  Box,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';

import {
  DashboardOutlined,
  Logout,
  Menu,
  TaskAltOutlined,
} from '@mui/icons-material';

const drawerWidth = 240;

interface ProtectedLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <DashboardOutlined />,
  },
  {
    label: 'Hábitos',
    href: '/habits',
    icon: <TaskAltOutlined />,
  },
];

export default function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      router.replace('/login');
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCheckingAuth(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [router]);

  const handleDrawerToggle = () => {
    setMobileOpen((previous) => !previous);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');

    router.replace('/login');
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Toolbar
        sx={{
          gap: 1.5,
          px: 2,
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            bgcolor: 'primary.light',
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
          }}
        >
          HF
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
          }}
        >
          Habit Forge
        </Typography>
      </Toolbar>

      <Divider />

      <List
        sx={{
          px: 1.5,
          py: 2,
        }}
      >
        {navigationItems.map((item) => {
          const isSelected =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={isSelected}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 42,
                  color: isSelected
                    ? 'primary.main'
                    : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      <List
        sx={{
          px: 1.5,
          py: 2,
        }}
      >
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 42,
              color: 'text.secondary',
            }}
          >
            <Logout />
          </ListItemIcon>

          <ListItemText primary="Cerrar sesión" />
        </ListItemButton>
      </List>
    </Box>
  );

  if (checkingAuth) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',

          width: {
            md: `calc(100% - ${drawerWidth}px)`,
          },

          ml: {
            md: `${drawerWidth}px`,
          },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: {
                md: 'none',
              },
            }}
            aria-label="Abrir menú"
          >
            <Menu />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 600 }}
          >
            Habit Forge
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: {
            md: drawerWidth,
          },
          flexShrink: {
            md: 0,
          },
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: {
              xs: 'block',
              md: 'none',
            },

            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          open
          sx={{
            display: {
              xs: 'none',
              md: 'block',
            },

            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            md: `calc(100% - ${drawerWidth}px)`,
          },
          p: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        <Toolbar />

        {children}
      </Box>
    </Box>
  );
}