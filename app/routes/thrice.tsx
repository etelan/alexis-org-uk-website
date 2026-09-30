import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import { MapControls, OrbitControls } from "@react-three/drei";
import './thrice.css'

const W = 4.25 // x
const H = 2.75 // y
const D = 0.56 // z
const PERIMETER = H + 3*D

const highResImageSRC = "images/high_res/"
const lowResImageSRC = "images/low_res/"
const lowResMode = true

// Loading manager code
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
  console.log(`Started loading: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`);
};

loadingManager.onLoad = async function () {
  console.log('Loading complete!');
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    loadingScreen.style.pointerEvents = 'none';
  }
}

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const progress = (itemsLoaded / itemsTotal) * 100; // Percentage
    document.getElementById('progress-bar')?.style.setProperty('width', `${progress}%`);
    document.getElementById('status-text')?.style.setProperty('textContent', `Loaded ${itemsLoaded}/${itemsTotal} assets`);
    console.log(`Progress: ${progress.toFixed(1)}%`);
};

// This creates our cassette texture from the image, with adjustable settings
function createCassetteTexture(image: HTMLImageElement, offset: number = 0, faceRatio: number[] = [W, H], heightMult: number=1, flip: boolean = false, base: string='#cccccc') {
  console.log(`The Image Is: ${image}`)
  const canvasWidth = faceRatio[0] * 700; 
  const canvasHeight = faceRatio[1] * 700 / heightMult;

  offset = offset == 0 ? 0 : (image.height / (PERIMETER / offset)) * -1
  const imageScaleUpRatio = canvasWidth / image.width;
  image.width = image.width * imageScaleUpRatio
  image.height = image.height * imageScaleUpRatio 

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.save();        
  
  ctx.save();
  if (flip) {
    ctx.translate(canvasWidth, canvasHeight); // origin → bottom edge
    ctx.scale(-1, -1);
  }
  ctx.drawImage(image, 0, offset, image.width, image.height);
  ctx.restore();  
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// All arrays are [back, top, front]
function Box({ position, imageSRC, imageOffsetArray, multArray, backupColour, flip = false }: { position: number, imageSRC: string, imageOffsetArray: number[], multArray: number[], backupColour?: string, flip?: boolean }) {  
  console.log("Loading image: " + imageSRC)
  const imageOffsetBack = imageOffsetArray[0]
  const imageOffsetTop = imageOffsetArray[1]
  const imageOffsetFront = imageOffsetArray[2]
  const imageTopMult = multArray[1]
  const imageFrontMult = multArray[2]
  const imageBackMult = multArray[0]
  let imageFrontBackupColour = backupColour || "#c2c2c2"

  const loaded = useLoader(
    THREE.TextureLoader,
    imageSRC,
    (loader) => {
      loader.manager = loadingManager;
    }
  );

  const materials = useMemo(() => {
    const plain = () => new THREE.MeshStandardMaterial({ color: "#cccccc" });
    const front = new THREE.MeshStandardMaterial({
      map: createCassetteTexture(loaded.image as HTMLImageElement, imageOffsetFront, [W, H], imageFrontMult, true, imageFrontBackupColour),
    });

    const top = new THREE.MeshStandardMaterial({
      map: createCassetteTexture(loaded.image as HTMLImageElement, PERIMETER - H + imageOffsetTop, [H, D], imageTopMult, true),
    });

    const back = new THREE.MeshStandardMaterial({
      map: createCassetteTexture(loaded.image as HTMLImageElement, PERIMETER + 2*D + imageOffsetBack, [W, H], imageBackMult, false),
    });

    // order: right, left, top, bottom, FRONT, back
    return [plain(), plain(), top, plain(), front, back];
  }, [loaded]);

  return (
    <mesh
      material={materials}
      position={[(position-5) * (D+0.2), 0, 0]}
      rotation={[0, flip ? Math.PI / 2 : -Math.PI / 2, 0]}
    >
      <boxGeometry args={[W, H, D]} />
    </mesh>
  );
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div id="loading-screen">
          <div id="progress-container">
              <div id="progress-bar"></div>
          </div>
          <p id="status-text">Loading assets...</p>
      </div>

      <Canvas 
        camera={{ position: [0, 7, 0], fov: 60 }}>
        <ambientLight intensity={2} />

        <MapControls
          enableRotate={false}
          onChange={(e) => { const c = e?.target; c.target.z = c.object.position.z = 0 }}/> // lock the orbit queen

        {/* GREEN R.E.M */}
        <Box 
          position={0} 
          imageSRC={lowResMode ? lowResImageSRC + "GREEN_REM.PNG" : highResImageSRC + "GREEN_REM.JPG"}
          imageOffsetArray={[-0.47, 0.1, 0]} 
          multArray={[1, 1.5, 0.97]}/>

        {/* Music Without Edges */}
        <Box 
          position={1} 
          imageSRC={lowResMode ? lowResImageSRC + "Robert_Cox_-_Music_Without_Edges.PNG" : highResImageSRC + "Robert_Cox_-_Music_Without_Edges.JPG"}
          imageOffsetArray={[-0.5, 0.09, 0]} 
          multArray={[1, 1.8, 1.09]} />

        {/* The Future Sound (Of London) */}
        <Box 
          position={3} 
          imageSRC={lowResMode ? lowResImageSRC + "the_future_sound_of_london.PNG" : highResImageSRC + "the_future_sound_of_london.JPG"}
          imageOffsetArray={[0, 0.2, 0]} 
          multArray={[1, 2, 1.07]} 
          flip={true}/>
  

        {/* The Sugar Cubes */}
        <Box 
          position={10} 
          imageSRC={lowResMode ? lowResImageSRC + "the_sugar_cubes_-_lifes_too_good.PNG" : highResImageSRC + "the_sugar_cubes_-_lifes_too_good.JPG"}
          imageOffsetArray={[-0.3, 0.2, 0]} 
          multArray={[1, 2, 1.05]} 
          flip={true}/>

        {/* DX20V */}
        <Box 
          position={5} 
          imageSRC={lowResMode ? lowResImageSRC + "DX20V_WAVE.PNG" : highResImageSRC + "DX20V_WAVE.JPG"}
          imageOffsetArray={[0, 0.23, -0.1]} 
          multArray={[1, 2, 1]}
          backupColour="#232323"/>
        
        {/* Rules For Radicals */}
        <Box 
          position={4} 
          imageSRC={lowResMode ? lowResImageSRC + "trench_art_-_RULES_FOR_RADICALS.PNG" : highResImageSRC + "trench_art_-_RULES_FOR_RADICALS.JPG"} 
          imageOffsetArray={[-0.32, 0.144, 0]} 
          multArray={[1, 1.7, 1.056]}
          backupColour="#c2c2c2" />

        {/* Artsy One */}
        <Box 
          position={7} 
          imageSRC={lowResMode ? lowResImageSRC + "Loris_S_Sarid_-_Innis_Chonnel_-_WHERE_THE_ROUND_THINGS_LIVE.PNG" : highResImageSRC + "Loris_S_Sarid_-_Innis_Chonnel_-_WHERE_THE_ROUND_THINGS_LIVE.JPG"} 
          imageOffsetArray={[-0.35, 0.155, -0.22]} 
          multArray={[1, 1.8, 1]}
          backupColour="#c2c2c2" />

        {/* Tragic Tigres Sad Meltdown */}
        <Box 
          position={6} 
          imageSRC={lowResMode ? lowResImageSRC + "Death_Is_Not_The_End_-_Tragic_Tigers_Sad_Meltdown.PNG" : highResImageSRC + "Death_Is_Not_The_End_-_Tragic_Tigers_Sad_Meltdown.JPG"} 
          imageOffsetArray={[-0.4, 0.14, 0]} 
          multArray={[1, 1.8, 1]}
          backupColour="#c2c2c2" />

        {/* from heaven */}
        <Box 
          position={9} 
          imageSRC={lowResMode ? lowResImageSRC + "exlruth_-_from_heaven.PNG" : highResImageSRC + "exlruth_-_from_heaven.JPG"} 
          imageOffsetArray={[-0.45, 0.07, 0]} 
          multArray={[1, 1.5, 1.05]}
          backupColour="#c2c2c2"
          flip={true} />

        {/* Esoteric Alchemy */}
        <Box 
          position={8} 
          imageSRC={lowResMode ? lowResImageSRC + "Alchemy_-_Esoteric.PNG" : highResImageSRC + "Alchemy_-_Esoteric.JPG"} 
          imageOffsetArray={[-0.35, 0.181, 0]} 
          multArray={[1, 1.9, 1.016]} />

        {/* Orchestral Rock */}
        <Box 
          position={2} 
          imageSRC={lowResMode ? lowResImageSRC + "The_Sythesizer_Rock_Orchestra_-_Orchestral_Rock.PNG" : highResImageSRC + "The_Sythesizer_Rock_Orchestra_-_Orchestral_Rock.JPG"} 
          imageOffsetArray={[-1.8, -0.37, 0]} 
          multArray={[1, 1.5, 0.94]}
          backupColour="#c2c2c2" />

      </Canvas>
    </div>
  );
}