import React, { useMemo, useState } from "react";
import { Card, CardContent, Button, Typography, Box } from "@mui/material";
import axios from "axios";

const PerformanceTracker = () => {
  const [performance, setPerformance] = useState(null);

  const fetchPerformance = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/get_performance`
    );
    setPerformance(response.data);
  };

  const values = useMemo(() => {
    let wins = 0;
    let losses = 0;
    let profit;

    performance?.statistic.map((res, index) => {
      if (res[4] !== "$0") {
        wins++;
      } else if (res[3] === "$0") {
        losses++;
      }
      var total_trades = wins + losses;
      if (total_trades > 0) profit = (wins / total_trades) * 100;
    });

    return [wins, losses, profit];
  }, [performance]);

  return (
    <Card sx={{ backgroundColor: "#2a3144", color: "white" }}>
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
          <Box sx={{ display: "flex", gap: 20 }}>
            <CardContent sx={{ pl: 0 }}>
              <Typography>WINS</Typography>
              <Typography>{values?.[0]}</Typography>
            </CardContent>
            <CardContent sx={{ pl: 0 }}>
              <Typography>LOSSES</Typography>
              <Typography>{values?.[1]}</Typography>
            </CardContent>
            <CardContent sx={{ pl: 0 }}>
              <Typography>PROFIT</Typography>
              <Typography>{values?.[2].toFixed(2)}%</Typography>
            </CardContent>
          </Box>
        )}

        {performance && performance?.bet_history?.length > 0 ? (
          performance?.bet_history.map((res, index) => (
            <div
              key={index}
              style={{ display: "flex", gap: 20, marginTop: 10 }}
            >
              <Typography>{res.date}</Typography>
              <Typography>{res.currency}</Typography>
              <Typography>{res.bet_type === "PUT" ? "SELL" : "BUY"}</Typography>
              <Typography>{performance?.statistic?.[index]?.[2]}</Typography>
              <Typography>{performance?.statistic?.[index]?.[4]}</Typography>
            </div>
          ))
        ) : (
          <Typography sx={{ mt: 1 }}>No betting yet.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceTracker;
