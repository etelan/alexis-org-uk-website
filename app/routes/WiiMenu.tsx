import '../WiiMenu.css';
import { CursorPresence } from "../components/cursor-presence";

export default function WiiMenu() {
  return (
    <div className="wii-menu-page">
      <CursorPresence />
      <div className="wii-whole-box">
        <div className="wii-grid">
          {Array.from({ length: 15 }).map((_, i) => (
            <div className="wii-tile" key={i} />
          ))}
        </div>
        <div className="wii-below-grid-bar">
          <div className="date">Sun 5/27</div>
        </div>
      </div>
    </div>
  );
}
