import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";

const Settings = () => {
  const [settings, setSettings] = useState({
    stop_loss: 10,
    take_profit: 10,
    risk_level: 1,
  });

  const updateSettings = async () => {
    await axios.post("http://localhost:5000/set_settings", settings);
    alert("Settings updated!");
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          Bot Settings
        </Typography>
        <TextField
          label="Stop Loss"
          type="number"
          value={settings.stop_loss}
          onChange={(e) =>
            setSettings({ ...settings, stop_loss: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Take Profit"
          type="number"
          value={settings.take_profit}
          onChange={(e) =>
            setSettings({ ...settings, take_profit: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Risk Level"
          type="number"
          value={settings.risk_level}
          onChange={(e) =>
            setSettings({ ...settings, risk_level: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={updateSettings}
          sx={{ mt: 1 }}
        >
          Update Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default Settings;
