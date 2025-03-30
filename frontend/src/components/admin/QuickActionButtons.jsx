import React from 'react';
import { useRouter } from 'next/router';
import { 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  Box, 
  Badge
} from '@mui/material';
import { 
  Verified as VerificationIcon,
  AccountBalance as PayoutIcon,
  Campaign as AnnouncementIcon,
  Report as ReportIcon
} from '@mui/icons-material';

const QuickActionButtons = ({ pendingVerifications = 0, pendingPayouts = 0 }) => {
  const router = useRouter();

  const actionButtons = [
    {
      title: 'Verification Requests',
      description: 'Review creator verification documents',
      icon: <VerificationIcon />,
      color: '#2e7d32',
      badge: pendingVerifications,
      action: () => router.push('/admin/verifications')
    },
    {
      title: 'Pending Payouts',
      description: 'Approve creator payout requests',
      icon: <PayoutIcon />,
      color: '#1976d2',
      badge: pendingPayouts,
      action: () => router.push('/admin/payouts')
    },
    {
      title: 'Send Announcement',
      description: 'Create a system-wide notification',
      icon: <AnnouncementIcon />,
      color: '#ed6c02',
      action: () => router.push('/admin/announcements/new')
    },
    {
      title: 'Review Reports',
      description: 'Handle reported content and users',
      icon: <ReportIcon />,
      color: '#d32f2f',
      action: () => router.push('/admin/reports')
    }
  ];

  return (
    <Grid container spacing={2}>
      {actionButtons.map((button, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <Paper 
            elevation={2}
            sx={{
              p: 2,
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              },
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: `${button.color}20`,
                  color: button.color,
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  mr: 1.5
                }}
              >
                {button.badge > 0 ? (
                  <Badge badgeContent={button.badge} color="error">
                    {button.icon}
                  </Badge>
                ) : (
                  button.icon
                )}
              </Box>
              <Typography variant="subtitle1" fontWeight="medium">
                {button.title}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {button.description}
            </Typography>
            
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={button.action}
              sx={{ 
                mt: 'auto',
                borderColor: button.color,
                color: button.color,
                '&:hover': {
                  borderColor: button.color,
                  backgroundColor: `${button.color}10`
                }
              }}
            >
              {button.badge > 0 ? `Review ${button.badge} Pending` : 'View'}
            </Button>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default QuickActionButtons;