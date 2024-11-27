import React, { useState } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { Button, TextField, Container, Typography, Box } from "@mui/material";

const FlightForm = () => {
  const [flightNumber, setFlightNumber] = useState("");
  const [altitude, setAltitude] = useState("");
  const [speed, setSpeed] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const socket = new SockJS("http://localhost:8080/virtual-websocket");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      const flightStatus = {
        flightNumber,
        altitude,
        speed,
        location,
      };
      stompClient.send("/app/updateFlightStatus", {}, JSON.stringify(flightStatus));
    });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Update Flight Status
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="Flight Number"
          value={flightNumber}
          onChange={(e) => setFlightNumber(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Altitude"
          value={altitude}
          onChange={(e) => setAltitude(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Speed"
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          margin="normal"
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Update Flight Status
        </Button>
      </Box>
    </Container>
  );
};

export default FlightForm;
