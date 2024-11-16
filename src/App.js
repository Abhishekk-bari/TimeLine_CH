import React, { useState, useEffect } from 'react';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import { Button, Container } from '@mui/material';
import moment from 'moment';
import data from './data/data.json';
import users from './data/users.json';

const App = () => {
  const [items, setItems] = useState([]);
  const [groups] = useState(users.users.map(user => ({ id: user.id, title: user.name })));
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(moment());

  useEffect(() => {
    const formattedItems = data.layers.flatMap(layer =>
      layer.layers.map(entry => ({
        id: Math.random(),
        group: entry.userId,
        title: `User ${entry.userId}`,
        start_time: moment(entry.startDate),
        end_time: moment(entry.endDate),
      }))
    );
    setItems(formattedItems);
  }, []);

  const handleToday = () => {
    setCurrentDate(moment());
    setView('month');
  };

  const handleNext = () => {
    setCurrentDate(currentDate.clone().add(1, view === 'month' ? 'months' : view === 'week' ? 'weeks' : 'days'));
  };

  const handlePrevious = () => {
    setCurrentDate(currentDate.clone().subtract(1, view === 'month' ? 'months' : view === 'week' ? 'weeks' : 'days'));
  };

  const [defaultTimeStart, defaultTimeEnd] = calculateTimeRange(view, currentDate);

  return (
    <Container sx={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Timeline Chart</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Button variant="contained" onClick={handleToday}>Today</Button>
        <Button variant="contained" onClick={handlePrevious}>Previous</Button>
        <Button variant="contained" onClick={handleNext}>Next</Button>
      </div>
      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={defaultTimeStart.toDate()}
        defaultTimeEnd={defaultTimeEnd.toDate()}
        itemRenderer={({ item }) => (
          <div style={{ backgroundColor: '#e8f4f8', padding: '10px', borderRadius: '4px' }}>{item.title}</div>
        )}
      />
    </Container>
  );
};

const calculateTimeRange = (view, currentDate) => {
  switch (view) {
    case 'month':
      return [currentDate.clone().startOf('month'), currentDate.clone().endOf('month')];
    case 'week':
      return [currentDate.clone().startOf('week'), currentDate.clone().endOf('week')];
    case 'day':
      return [currentDate.clone().startOf('day'), currentDate.clone().endOf('day')];
    default:
      return [currentDate.clone().startOf('month'), currentDate.clone().endOf('month')];
  }
};

export default App;
