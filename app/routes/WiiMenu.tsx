import '../WiiMenu.css';
import { CursorPresence } from "../components/cursor-presence";
import { useEffect, useState } from "react";

// Update the time every second
function useTime() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return dateTime;
}

export default function WiiMenu() {
  const dateTime = useTime();
  const formattedTime = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = dateTime.toLocaleDateString([], { weekday: 'short', month: 'numeric', day: 'numeric' }); // Sun 2/10 
  return (
    <div className="wii-menu-page">
      <CursorPresence />
      <div className="wii-whole-box">
        <div className="wii-grid">
          {Array.from({ length: 15 }).map((_, i) => (
            <div className="wii-tile" key={i} />
          ))}
        </div>
        <div className="wii-footer">
          <div className="timebox">
            <div className="time">{formattedTime}</div>
          </div>
          <div className="date">{formattedDate}</div>
        </div>
      </div>
    </div>
  );
}
