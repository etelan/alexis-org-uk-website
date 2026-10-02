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
  
  const tileData = [
    { id: 1, image: 'images/wii_menu/CV_Tile.png', imageAlt: 'CV Tile', url: 'https://alexis.org.uk/cv' },
    { id: 2, image: 'images/wii_menu/Cassette_Tile.png', imageAlt: 'Cassette Tile', url: 'https://cassettes.alexis.org.uk' },
    { id: 3, image: 'images/wii_menu/GitHub_Tile.png', imageAlt: 'Github Tile', url: 'https://github.com/etelan' },
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
              <a className="wii-tile" href={tile.url} key={i}>
                <img
                  className="wii-tile-image"
                  src={tile.image}
                  alt={tile.imageAlt}
                />
              </a>
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
