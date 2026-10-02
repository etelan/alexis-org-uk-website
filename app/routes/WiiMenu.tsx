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
  
  // For specific tiles, we should have specific images / onclick directs
  const tileData = [
    { id: 1, image: 'images/tile1.png', onClick: () => console.log('Tile 1 clicked') },
    { id: 2, image: 'images/wii_menu/Cassette_Tile.png', onClick: () => location.href='https://cassettes.alexis.org.uk' },
  ];

  return (
    <div className="wii-menu-page">
      <CursorPresence />
      <div className="wii-whole-box">
        <div className="wii-grid">
          {Array.from({ length: 15 }).map((_, i) => {
            const tile = tileData.find((t) => t.id === i + 1); // ids are 1-based

            if (!tile) return <div className="wii-tile" key={i} />;

            return (
              <button
                type="button"
                className="wii-tile"
                key={i}
                onClick={tile.onClick}
                style={{ backgroundImage: `url(${tile.image})` }}
                aria-label={`Tile ${tile.id}`}
              />
            );
          })}
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
