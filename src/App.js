import React, { useState, useEffect } from "react";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import { Button } from "@mui/material";
import moment from "moment";
import data from "./data/data.json";
import users from "./data/users.json";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./index.css"; // Add this import

const App = () => {
  const [items, setItems] = useState([]);
  const [groups] = useState(
    users.users.map((user) => ({ id: user.id, title: user.name }))
  );
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedLayer, setSelectedLayer] = useState("All");

  const userColors = {};
  users.users.forEach((user) => {
    userColors[user.id] =
      "#" + Math.floor(Math.random() * 16777215).toString(16);
  });

  useEffect(() => {
    const formattedItems = data.layers.flatMap((layer) =>
      layer.layers.map((entry) => ({
        id: Math.random(),
        group: entry.userId,
        title: entry.description || "No description provided",
        start_time: moment(entry.startDate),
        end_time: moment(entry.endDate),
        layerName: layer.name, // Add layer name for filtering
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
        .add(
          1,
          view === "month" ? "months" : view === "week" ? "weeks" : "days"
        )
    );
  };

  const handlePrevious = () => {
    setCurrentDate(
      currentDate
        .clone()
        .subtract(
          1,
          view === "month" ? "months" : view === "week" ? "weeks" : "days"
        )
    );
  };

  const calculateTimeRange = (view, currentDate) => {
    switch (view) {
      case "month":
        return [
          currentDate.clone().startOf("month"),
          currentDate.clone().endOf("month"),
        ];
      case "week":
        return [
          currentDate.clone().startOf("week"),
          currentDate.clone().endOf("week"),
        ];
      case "day":
        return [
          currentDate.clone().startOf("day"),
          currentDate.clone().endOf("day"),
        ];
      default:
        return [
          currentDate.clone().startOf("month"),
          currentDate.clone().endOf("month"),
        ];
    }
  };

  const [visibleTime, setVisibleTime] = useState(() =>
    calculateTimeRange(view, currentDate)
  );

  useEffect(() => {
    setVisibleTime(calculateTimeRange(view, currentDate));
  }, [view, currentDate]);

  const filteredItems =
    selectedLayer === "All"
      ? items
      : items.filter((item) => item.layerName === selectedLayer);

  return (
    <div className="p-4 pt-20">
      <h1 className="text-center text-4xl font-bold mb-8">Timeline Chart</h1>

      {/* Layer Selection */}
      <div className="mb-4">
        <div className="flex gap-2 justify-center">
          {["All", "layers", "Layer 1", "Layer 2", "Override Layer", "Final Schedule"].map((layer) => (
            <button
              key={layer}
              className={`px-4 py-2 rounded ${
                selectedLayer === layer
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 border hover:bg-gray-200"
              }`}
              onClick={() => setSelectedLayer(layer)}
            >
              {layer}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-2">
          <button
            onClick={handleToday}
            className="px-4 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
          >
            TODAY
          </button>
          <button
            className="p-1 text-gray-400 hover:text-gray-600"
            onClick={handlePrevious}
          >
            <ArrowBackIcon />
          </button>
          <button
            className="p-1 text-gray-400 hover:text-gray-600"
            onClick={handleNext}
          >
            <ArrowForwardIcon />
          </button>
        </div>

        <div className="flex gap-2">
          {["day", "2day", "week", "2week", "month"].map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setView(timeframe)}
              className={`px-3 py-1 text-sm rounded ${
                view === timeframe
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {timeframe.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <Timeline
          groups={groups}
          items={filteredItems}
          defaultTimeStart={visibleTime[0].toDate()}
          defaultTimeEnd={visibleTime[1].toDate()}
          itemRenderer={({ item }) => (
            <div
              style={{
                backgroundColor: item.bgColor,
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 5px",
                color: "#000",
                fontWeight: "bold",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                borderRadius: "4px",
              }}
              className="timeline-item"
            >
              {item.title}
            </div>
          )}
          visibleTimeStart={visibleTime[0].valueOf()}
          visibleTimeEnd={visibleTime[1].valueOf()}
          className="border rounded-lg"
        />
      </div>
    </div>
  );
};

export default App;
