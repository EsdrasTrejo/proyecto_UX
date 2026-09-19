import {
  Box,
  Paper,
  Typography,
} from '@mui/material';

interface SummaryCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
}

export default function SummaryCard({
  title,
  value,
  subtitle,
  icon,
}: SummaryCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',

        minHeight: 125,
      }}
    >
      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 0.75 }}
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          sx={{ fontWeight: 700 }}
        >
          {value}
        </Typography>

        {subtitle && (
          <Typography
            variant="caption"
            color="text.secondary"
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          width: 46,
          height: 46,
          borderRadius: 2,

          bgcolor: 'primary.light',
          color: 'primary.main',

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
    </Paper>
  );
}