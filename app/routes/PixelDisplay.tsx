import '../PixelDisplay.css';
import { CursorPresence } from "../components/cursor-presence";
import { useState } from "react";

export default function WiiMenu() {

  const [pixelColourGrid, setPixelColourGrid] = useState<string[]>(Array(1024).fill("#ffffff"));
  const [isDrawing, setIsDrawing] = useState(false);

  const colourPixel = (index: number) => {
    setPixelColourGrid((colors) => {
      if (colors[index] === "#000000") return colors;
      const newColors = [...colors];
      newColors[index] = "#000000";
      return newColors;
    });
  };

  return (
    <div className="wii-menu-page">
      <CursorPresence />
      <div className="wii-whole-box">
        <div className="pixel-grid">
          {Array.from({ length: 1024 }).map((_, i) => (
            <div
              className="wii-tile"
              key={i}
              style={{ backgroundColor: pixelColourGrid[i] }}
              onPointerDown={(event) => {
                event.preventDefault();
                setIsDrawing(true);
                colourPixel(i);
              }}
              onPointerEnter={() => {
                if (isDrawing) colourPixel(i);
              }}
              onPointerUp={() => setIsDrawing(false)}
            />
          ))}
        </div>
        <div className="wii-below-grid-bar">
          <div className="date">Sun 246846/27</div>
        </div>
      </div>
    </div>
  );
}
