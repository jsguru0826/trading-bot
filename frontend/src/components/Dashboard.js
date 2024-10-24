import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";

const Dashboard = () => {
  const [tradeSettings, setTradeSettings] = useState({
    amount: 1,
    asset: "EUR/USD",
    duration: "60",
    direction: "buy", // Added direction (buy/sell)
  });

  const startTrade = async () => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/start_trade`,
      tradeSettings
    );
    // alert(`Trade executed: ${response.data.result || response.data.error}`);
    alert(`Trade executed`);
  };

  return (
    <Card sx={{ backgroundColor: "#2a3144", color: "white" }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          Start a New Trade
        </Typography>
        <TextField
          label="Amount"
          type="number"
          value={tradeSettings.amount}
          onChange={(e) =>
            setTradeSettings({ ...tradeSettings, amount: e.target.value })
          }
          fullWidth
          margin="normal"
          InputProps={{
            style: {
              color: "white",
            },
          }}
          sx={{
            backgroundColor: "#1f2334",
            label: {
              color: "white",
            },
          }}
        />
        <TextField
          label="Asset"
          value={tradeSettings.asset}
          onChange={(e) =>
            setTradeSettings({ ...tradeSettings, asset: e.target.value })
          }
          fullWidth
          margin="normal"
          InputProps={{
            style: {
              color: "white",
            },
          }}
          sx={{
            backgroundColor: "#1f2334",
            label: {
              color: "white",
            },
          }}
        />

        <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
          <InputLabel
            id="Duration"
            sx={{
              color: "white",
            }}
          >
            Duration (time)
          </InputLabel>
          <Select
            labelId="Duration"
            id="demo-simple-select"
            value={tradeSettings.duration}
            label="Duration (time)"
            onChange={(e) =>
              setTradeSettings({ ...tradeSettings, duration: e.target.value })
            }
            sx={{
              backgroundColor: "#1f2334",
              color: "white",
            }}
          >
            <MenuItem value="5">5s</MenuItem>
            <MenuItem value="15">15s</MenuItem>
            <MenuItem value="30">30s</MenuItem>
            <MenuItem value="60">60s</MenuItem>
            <MenuItem value="180">3min</MenuItem>
            <MenuItem value="300">5min</MenuItem>
            <MenuItem value="1800">30min</MenuItem>
            <MenuItem value="3600">1h</MenuItem>
            <MenuItem value="14400">4h</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 1 }}>
          <InputLabel
            id="Direction"
            sx={{
              color: "white",
            }}
          >
            Direction
          </InputLabel>
          <Select
            labelId="Direction"
            id="demo-simple-select"
            value={tradeSettings.direction}
            label="Direction"
            onChange={(e) =>
              setTradeSettings({ ...tradeSettings, direction: e.target.value })
            }
            sx={{
              backgroundColor: "#1f2334",
              color: "white",
            }}
          >
            <MenuItem value="buy">Buy</MenuItem>
            <MenuItem value="sell">Sell</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={startTrade}
          sx={{ mt: 2 }}
        >
          Start Trade
        </Button>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
