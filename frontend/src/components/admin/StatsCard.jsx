import React from 'react';
import { Paper, Typography, Box, Icon } from '@mui/material';

const StatsCard = ({ title, value, subtitle, icon, color }) => {
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 2, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderLeft: `4px solid ${color || '#1976d2'}`,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Typography variant="h6" component="h2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
          {title}
        </Typography>
        <Icon sx={{ color: color || '#1976d2', opacity: 0.8 }}>{icon}</Icon>
      </Box>
      
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', my: 1 }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Typography>
      
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto' }}>
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
};

export default StatsCard;