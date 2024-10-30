import React from "react";
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
  Box,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

const Dashboard = ({
  setIsTradeStart,
  tradeSettings,
  setTradeSettings,
  loadingTradeStart,
  setLoadingTradeStart,
}) => {
  const startTrade = async () => {
    setLoadingTradeStart(true);
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/start_trade`,
      tradeSettings
    );
    setLoadingTradeStart(false);
    setIsTradeStart(true);
    // alert(`Trade started`);
  };

  const stopTrade = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/trading_stop`,
    );
  }

  return (
    <Card sx={{ backgroundColor: "#2a3144", color: "white" }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          Start a New Trade
        </Typography>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel
            id="Direction"
            sx={{
              color: "white",
            }}
          >
            Quick Trading
          </InputLabel>
          <Select
            labelId="Direction"
            id="demo-simple-select"
            value={tradeSettings.is_live}
            label="Quick Trading"
            onChange={(e) =>
              setTradeSettings({ ...tradeSettings, is_live: e.target.value })
            }
            sx={{
              backgroundColor: "#1f2334",
              color: "white",
            }}
            defaultValue={false}
          >
            <MenuItem value={false}>Demo</MenuItem>
            <MenuItem value={true}>Live</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Amount"
          type="number"
          value={tradeSettings.amount}
          onChange={(e) =>
            setTradeSettings({ ...tradeSettings, amount: e.target.value })
          }
          onBlur={(e) =>
            setTradeSettings({ ...tradeSettings, amount: e.target.value > 1 ? e.target.value : 1 })
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

        {/* <FormControl fullWidth sx={{ mt: 1 }}>
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
        </FormControl> */}

        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={startTrade}
            disabled={loadingTradeStart}
          >
            Start Trade
          </Button>
          {loadingTradeStart && <><CircularProgress /><div>Starting...</div>
          
          <Button
            variant="contained"
            color="primary"
            onClick={stopTrade}
          >
            Stop Trade
          </Button>
          </>}
        </Box>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
