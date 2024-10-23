import React, { useState } from "react";
import { Card, CardContent, Button, Typography } from "@mui/material";
import axios from "axios";

const PerformanceTracker = () => {
  const [performance, setPerformance] = useState(null);

  const fetchPerformance = async () => {
    const response = await axios.get("http://localhost:5000/get_performance");
    setPerformance(response.data);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          Performance Tracker
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchPerformance}
          sx={{ mt: 2 }}
        >
          Get Performance
        </Button>
        {performance && (
          <CardContent sx={{ pl: 0 }}>
            <Typography>Total Trades: {performance.total_trades}</Typography>
            <Typography>Wins: {performance.wins}</Typography>
            <Typography>Losses: {performance.losses}</Typography>
            <Typography>Profit: {performance.profit}</Typography>
          </CardContent>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceTracker;
