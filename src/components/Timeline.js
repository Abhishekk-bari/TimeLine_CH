import React, { useState, useEffect } from "react";
import { Button, Typography, Box } from "@mui/material";
import { Grid } from '@mui/material';
import { TimelineChart } from "./TimelineChart";
import dayjs from "dayjs";


const Timeline = () => {
  const [view, setView] = useState("month"); // Default to month view
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentDate, setCurrentDate] = useState(dayjs());

  useEffect(() => {
    // Fetch data
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setEvents(data.events));

    fetch("/users.json")
      .then((res) => res.json())
      .then((data) => setUsers(data.users));
  }, []);

  const changeView = (newView) => setView(newView);
  const goToday = () => setCurrentDate(dayjs());
  const goNext = () => setCurrentDate(currentDate.add(1, view));
  const goPrevious = () => setCurrentDate(currentDate.subtract(1, view));
  return (
    <Box p={2}>
      <Typography variant="h4">Timeline Chart</Typography>
      <Grid container spacing={2}>
        <Grid item>
          <Button variant="outlined" onClick={() => goToday()}>
            Today
          </Button>
          <Button variant="outlined" onClick={() => changeView("month")}>
            1 Month
          </Button>
          <Button variant="outlined" onClick={() => changeView("week")}>
            1 Week
          </Button>
        </Grid>

         {/* Navigation Buttons */}
         <Grid item>
          <Button variant="outlined" onClick={goPrevious}>
            Previous
          </Button>
          <Button variant="outlined" onClick={goNext}>
            Next
          </Button>
        </Grid>

      </Grid>
      <TimelineChart
        events={events}
        users={users}
        view={view}
        currentDate={currentDate}
      />
    </Box>
  );
};

export default Timeline;
