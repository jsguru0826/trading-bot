import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Grid, Button } from '@mui/material';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import MarketScanner from './components/MarketScanner';
import PerformanceTracker from './components/PerformanceTracker';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Container maxWidth="lg">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pocket Option Scalping Bot
          </Typography>
          <Button color="inherit" onClick={() => setActiveTab('dashboard')}>Dashboard</Button>
          <Button color="inherit" onClick={() => setActiveTab('settings')}>Settings</Button>
          <Button color="inherit" onClick={() => setActiveTab('market')}>Market Scanner</Button>
          <Button color="inherit" onClick={() => setActiveTab('performance')}>Performance</Button>
        </Toolbar>
      </AppBar>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {activeTab === 'dashboard' && (
          <Grid item xs={12}>
            <Dashboard />
          </Grid>
        )}
        {activeTab === 'settings' && (
          <Grid item xs={12}>
            <Settings />
          </Grid>
        )}
        {activeTab === 'market' && (
          <Grid item xs={12}>
            <MarketScanner />
          </Grid>
        )}
        {activeTab === 'performance' && (
          <Grid item xs={12}>
            <PerformanceTracker />
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default App;