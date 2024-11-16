import React from "react";
import { Bar } from "react-chartjs-2";
import dayjs from "dayjs";

const TimelineChart = ({ events = [], users = [], view, currentDate }) => {
  const generateTimelineData = () => {
    const labels = []; // Dates in the range
    const datasets = []; // Data per user

    const startDate = dayjs(currentDate).startOf(view);
    const endDate = dayjs(currentDate).endOf(view);

    // Populate labels with all dates in the range
    for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate); date = date.add(1, "day")) {
      labels.push(date.format("YYYY-MM-DD"));
    }

    // Generate datasets for each user
    users.forEach((user) => {
      const userEvents = events.filter((e) => e.user_id === user.id);

      datasets.push({
        label: user.name,
        data: labels.map((label) =>
          userEvents.some((e) => e.date === label) ? 1 : 0
        ),
        backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(
          16
        )}`, // Generate a random color for each user
      });
    });

    return { labels, datasets };
  };

  return (
    <Bar
      data={generateTimelineData()}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Timeline Chart",
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Dates",
            },
          },
          y: {
            title: {
              display: true,
              text: "Presence (1 = Yes, 0 = No)",
            },
            ticks: {
              stepSize: 1,
            },
          },
        },
      }}
    />
  );
};

export default TimelineChart;
