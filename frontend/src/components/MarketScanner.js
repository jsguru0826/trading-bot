import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Typography } from "@mui/material";
import axios from "axios";

const MarketScanner = () => {
  const [opportunities, setOpportunities] = useState();

  const scanMarket = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/scan_market`);
    setOpportunities(response.data);
  };

  useEffect(() => {
    scanMarket();

    const interval = setInterval(() => {
      scanMarket();
    }, 20000); // Update performance every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
          Market Opportunities
        </Typography>
        {/* <Button
          variant="contained"
          color="primary"
          onClick={scanMarket}
          sx={{ mt: 2, mb: 2 }}
        >
          Scan Market
        </Button> */}
        {opportunities && Object.keys(opportunities?.stack)?.length > 0 ? (
          Object.entries(opportunities?.stack)
            .reverse() // Reverse the stack
            .map(([timestamp, value], index) => (
              <div
                key={index}
                style={{ display: "flex", gap: 20, marginBottom: 5 }}
              >
                <Typography>
                  {new Date(parseInt(timestamp) * 1000).toLocaleString()}{" "}
                </Typography>
                <Typography>{opportunities.currency}</Typography>
                <Typography>{value}</Typography>
              </div>
            ))
        ) : (
          <Typography>No opportunities found.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketScanner;
