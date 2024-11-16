import React, { useState, useEffect } from 'react';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import { Button, Container } from '@mui/material';
import moment from 'moment';
import data from './data/data.json';
import users from './data/users.json';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './index.css'; // Add this import


const App = () => {
  const [items, setItems] = useState([]);
  const [groups] = useState(
    users.users.map(user => ({ id: user.id, title: user.name }))
  );
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(moment());

  // User ID color map for consistent colors
  const userColors = {};
  users.users.forEach(user => {
    userColors[user.id] =
      '#' + Math.floor(Math.random() * 16777215).toString(16); // Random color generation
  });

  useEffect(() => {
    const formattedItems = data.layers.flatMap(layer =>
      layer.layers.map(entry => ({
        id: Math.random(),
        group: entry.userId,
        title: entry.description || `User ${entry.userId}`, // Show description if available, otherwise show User ID
        start_time: moment(entry.startDate),
        end_time: moment(entry.endDate),
        bgColor: userColors[entry.userId],
      }))
    );
    setItems(formattedItems);
  }, []);

  const handleToday = () => {
    setCurrentDate(moment());
  };

  const handleNext = () => {
    setCurrentDate(
      currentDate
        .clone()
        .add(1, view === 'month' ? 'months' : view === 'week' ? 'weeks' : 'days')
    );
  };

  const handlePrevious = () => {
    setCurrentDate(
      currentDate
        .clone()
        .subtract(
          1,
          view === 'month' ? 'months' : view === 'week' ? 'weeks' : 'days'
        )
    );
  };

  const calculateTimeRange = (view, currentDate) => {
    switch (view) {
      case 'month':
        return [
          currentDate.clone().startOf('month'),
          currentDate.clone().endOf('month'),
        ];
      case 'week':
        return [
          currentDate.clone().startOf('week'),
          currentDate.clone().endOf('week'),
        ];
      case 'day':
        return [
          currentDate.clone().startOf('day'),
          currentDate.clone().endOf('day'),
        ];
      default:
        return [
          currentDate.clone().startOf('month'),
          currentDate.clone().endOf('month'),
        ];
    }
  };

  const [defaultTimeStart, defaultTimeEnd] = calculateTimeRange(
    view,
    currentDate
  );

  return (
    <div className="p-4">
      <h1 className="text-center text-2xl font-bold mb-8">Timeline Chart</h1>
      {/* Top navigation buttons */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-2">
          <button onClick={handleToday} className="px-4 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
            TODAY
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-600" onClick={handlePrevious}>
            <ArrowBackIcon />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-600" onClick={handleNext}>
            <ArrowForwardIcon />
          </button>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setView('day')}
            className={`px-3 py-1 text-sm rounded ${
              view === 'day' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            1 DAY
          </button>
          <button 
            onClick={() => setView('2day')}
            className={`px-3 py-1 text-sm rounded ${
              view === '2day' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            2 DAY
          </button>
          <button 
            onClick={() => setView('week')}
            className={`px-3 py-1 text-sm rounded ${
              view === 'week' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            1 WEEK
          </button>
          <button 
            onClick={() => setView('2week')}
            className={`px-3 py-1 text-sm rounded ${
              view === '2week' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            2 WEEK
          </button>
          <button 
            onClick={() => setView('month')}
            className={`px-3 py-1 text-sm rounded ${
              view === 'month' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            1 MONTH
          </button>
        </div>
      </div>

      {/* Timeline section */}
      <div className="bg-white rounded-lg shadow-sm">
        <Timeline
          groups={groups}
          items={items}
          defaultTimeStart={defaultTimeStart.toDate()}
          defaultTimeEnd={defaultTimeEnd.toDate()}
          itemRenderer={({ item }) => (
            <div
              style={{
                backgroundColor: item.bgColor,
                height: '100%',
              }}
              className="rounded px-2 py-1 text-white text-sm"
            >
              {item.title}
            </div>
          )}
          visibleTimeStart={defaultTimeStart.valueOf()}
          visibleTimeEnd={defaultTimeEnd.valueOf()}
          className="border rounded-lg"
        />
      </div>
    </div>
  );
};

export default App;
