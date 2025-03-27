import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Typography, 
  Divider, 
  Paper,
  Box,
  Chip
} from '@mui/material';
import { 
  Payment as PaymentIcon,
  AccountBalance as PayoutIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

const RecentActivityList = ({ payments = [], payouts = [] }) => {
  // Combine payments and payouts and sort by date
  const activities = [
    ...payments.map(payment => ({
      ...payment,
      type: 'payment',
      date: new Date(payment.createdAt)
    })),
    ...payouts.map(payout => ({
      ...payout,
      type: 'payout',
      date: new Date(payout.createdAt)
    }))
  ].sort((a, b) => b.date - a.date).slice(0, 10);

  if (activities.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">No recent activity</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2}>
      <List sx={{ p: 0 }}>
        {activities.map((activity, index) => (
          <React.Fragment key={`${activity.type}-${activity.id}`}>
            {index > 0 && <Divider component="li" />}
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar 
                  sx={{ 
                    bgcolor: activity.type === 'payment' ? 'primary.main' : 'secondary.main' 
                  }}
                >
                  {activity.type === 'payment' ? <PaymentIcon /> : <PayoutIcon />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography component="span" variant="subtitle1" fontWeight="medium">
                      {activity.type === 'payment' 
                        ? `Payment from ${activity.user?.username || 'User'}`
                        : `Payout to ${activity.user?.username || 'Creator'}`
                      }
                    </Typography>
                    <Chip 
                      size="small"
                      label={`$${activity.amount?.toFixed(2) || '0.00'}`}
                      color={activity.type === 'payment' ? 'success' : 'primary'}
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={
                  <React.Fragment>
                    <Typography component="span" variant="body2" color="text.primary">
                      {activity.status}
                    </Typography>
                    {" • "}
                    <Typography component="span" variant="body2" color="text.secondary">
                      {formatDistanceToNow(activity.date, { addSuffix: true })}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default RecentActivityList;