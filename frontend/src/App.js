import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Button,
} from "@mui/material";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import MarketScanner from "./components/MarketScanner";
import PerformanceTracker from "./components/PerformanceTracker";

import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isTradeStart, setIsTradeStart] = useState(false);

  const [tradeSettings, setTradeSettings] = useState({
    amount: 1,
    asset: "EUR/USD",
    duration: "60",
    direction: "buy", // Added direction (buy/sell)
  });

  return (
    <Container maxWidth="lg">
      <AppBar position="static" sx={{ backgroundColor: "#1c202e" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pocket Option Scalping Bot
          </Typography>
          <Button color="inherit" onClick={() => setActiveTab("dashboard")}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => setActiveTab("settings")}>
            Settings
          </Button>
          <Button color="inherit" onClick={() => setActiveTab("market")}>
            Market Scanner
          </Button>
          <Button color="inherit" onClick={() => setActiveTab("performance")}>
            Performance
          </Button>
        </Toolbar>
      </AppBar>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {activeTab === "dashboard" && (
          <Grid item xs={12}>
            <Dashboard
              isTradeStart={isTradeStart}
              setIsTradeStart={setIsTradeStart}
              tradeSettings={tradeSettings}
              setTradeSettings={setTradeSettings}
            />
          </Grid>
        )}
        {activeTab === "settings" && (
          <Grid item xs={12}>
            <Settings />
          </Grid>
        )}
        {activeTab === "market" && (
          <Grid item xs={12}>
            <MarketScanner />
          </Grid>
        )}
        {activeTab === "performance" && (
          <Grid item xs={12}>
            <PerformanceTracker />
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default App;
