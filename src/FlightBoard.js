import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import FlightForm from "./FlightForm";

const FlightBoard = () => {
  const [flightData, setFlightData] = useState([]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/virtual-websocket");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe("/topic/flightStatus", (message) => {
        if (message.body) {
          const updatedFlight = JSON.parse(message.body);
          setFlightData((prevData) => {
            const updatedData = prevData.filter(
              (data) => data.flightNumber !== updatedFlight.flightNumber
            );
            return [...updatedData, updatedFlight];
          });
        }
      });
    });

    return () => {
      stompClient.disconnect();
    };
  }, []);

  return (
    <div>
      <FlightForm />
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Flight Number</TableCell>
              <TableCell>Altitude</TableCell>
              <TableCell>Speed</TableCell>
              <TableCell>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flightData.map((flightInfo, index) => (
              <TableRow key={index}>
                <TableCell>{flightInfo.flightNumber}</TableCell>
                <TableCell>{flightInfo.altitude}</TableCell>
                <TableCell>{flightInfo.speed}</TableCell>
                <TableCell>{flightInfo.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default FlightBoard;
