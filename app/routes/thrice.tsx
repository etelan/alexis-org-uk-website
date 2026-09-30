import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";

const W = 4.25 // x
const H = 2.75 // y
const D = 0.56 // z
const PERIMETER = H + 3*D

const highResImageSRC = "images/high_res/"
const lowResImageSRC = "images/low_res/"
const lowResMode = true

// Paints: grey everywhere, then the image squished into the left half
function makeHalfImageTexture(image: HTMLImageElement, offset: number = 0, faceRatio: number[] = [W, H], heightMult: number=1, flip: boolean = false, base: string='#cccccc') {
  const canvasWidth = faceRatio[0] * 500; 
  const canvasHeight = faceRatio[1] * 500 / heightMult;

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
function Box({ position, imageSRC, imageOffsetArray, multArray, backupColour }: { position: number, imageSRC: string, imageOffsetArray: number[], multArray: number[], backupColour?: string }) {
  const loaded = useTexture(imageSRC); // waits until the image is ready
  const imageOffsetBack = imageOffsetArray[0]
  const imageOffsetTop = imageOffsetArray[1]
  const imageOffsetFront = imageOffsetArray[2]
  const imageTopMult = multArray[1]
  const imageFrontMult = multArray[2]
  const imageBackMult = multArray[0]
  let imageFrontBackupColour = backupColour || "#c2c2c2"

  const materials = useMemo(() => {
    const plain = () => new THREE.MeshStandardMaterial({ color: "#cccccc" });
    const front = new THREE.MeshStandardMaterial({
      map: makeHalfImageTexture(loaded.image as HTMLImageElement, imageOffsetFront, [W, H], imageFrontMult, true, imageFrontBackupColour),
    });

    const top = new THREE.MeshStandardMaterial({
      map: makeHalfImageTexture(loaded.image as HTMLImageElement, PERIMETER - H + imageOffsetTop, [H, D], imageTopMult, true),
    });

    const back = new THREE.MeshStandardMaterial({
      map: makeHalfImageTexture(loaded.image as HTMLImageElement, PERIMETER + 2*D + imageOffsetBack, [W, H], imageBackMult, false),
    });

    // order: right, left, top, bottom, FRONT, back
    return [plain(), plain(), top, plain(), front, back];
  }, [loaded]);

  return (
    <mesh
      material={materials}
      position={[(position-5) * (D+0.2), 0, 0]}
      rotation={[0, -Math.PI / 2, 0]}
    >
      <boxGeometry args={[W, H, D]} />
    </mesh>
  );
}

export default function Scene() {
  // return (
  //       <div style={{ width: '100vw', height: '100vh' }}>
  //         <Canvas camera={{ position: [3, 3, 3], fov: 60 }}>
  //           <ambientLight intensity={1.5} />
  //           <scene>
    
  //           </scene>
  //           <Box position={[0, 0, 0]} />
  //           <OrbitControls />
  //         </Canvas>
  //       </div>

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 7, 0], fov: 60 }}>
        <ambientLight intensity={4} />
        <scene>

        </scene>

        <Box 
          position={0} 
          imageSRC={lowResMode ? lowResImageSRC + "GREEN_REM.PNG" : highResImageSRC + "GREEN_REM.JPG"}
          imageOffsetArray={[-0.47, 0.1, 0]} 
          multArray={[1, 1.5, 0.97]}/>

        <Box 
          position={1} 
          imageSRC={lowResMode ? lowResImageSRC + "Robert_Cox_-_Music_Without_Edges.PNG" : highResImageSRC + "Robert_Cox_-_Music_Without_Edges.JPG"}
          imageOffsetArray={[-0.5, 0.09, 0]} 
          multArray={[1, 1.8, 1.09]} />

        <Box 
          position={2} 
          imageSRC={lowResMode ? lowResImageSRC + "DX20V_WAVE.PNG" : highResImageSRC + "DX20V_WAVE.JPG"}
          imageOffsetArray={[0, 0.23, -0.1]} 
          multArray={[1, 2, 1]}
          backupColour="#232323"/>

        <Box 
          position={3} 
          imageSRC={lowResMode ? lowResImageSRC + "the_sugar_cubes_-_lifes_too_good.PNG" : highResImageSRC + "the_sugar_cubes_-_lifes_too_good.JPG"}
          imageOffsetArray={[-0.3, 0.2, 0]} 
          multArray={[1, 2, 1.05]} />

        <Box 
          position={4} 
          imageSRC={lowResMode ? lowResImageSRC + "the_future_sound_of_london.PNG" : highResImageSRC + "the_future_sound_of_london.JPG"}
          imageOffsetArray={[0, 0.2, 0]} 
          multArray={[1, 2, 1.07]} />

        <Box 
          position={5} 
          imageSRC={lowResMode ? lowResImageSRC + "Alchemy_-_Esoteric.PNG" : highResImageSRC + "Alchemy_-_Esoteric.JPG"} 
          imageOffsetArray={[-0.35, 0.181, 0]} 
          multArray={[1, 1.9, 1.016]} />

        <Box 
          position={6} 
          imageSRC={lowResMode ? lowResImageSRC + "Loris_S_Sarid_-_Innis_Chonnel_-_WHERE_THE_ROUND_THINGS_LIVE.PNG" : highResImageSRC + "Loris_S_Sarid_-_Innis_Chonnel_-_WHERE_THE_ROUND_THINGS_LIVE.JPG"} 
          imageOffsetArray={[-0.35, 0.155, -0.22]} 
          multArray={[1, 1.8, 1]}
          backupColour="#c2c2c2" />

        <Box 
          position={7} 
          imageSRC={lowResMode ? lowResImageSRC + "Death_Is_Not_The_End_-_Tragic_Tigers_Sad_Meltdown.PNG" : highResImageSRC + "Death_Is_Not_The_End_-_Tragic_Tigers_Sad_Meltdown.JPG"} 
          imageOffsetArray={[-0.4, 0.14, 0]} 
          multArray={[1, 1.8, 1]}
          backupColour="#c2c2c2" />

        <Box 
          position={8} 
          imageSRC={lowResMode ? lowResImageSRC + "exlruth_-_from_heaven.PNG" : highResImageSRC + "exlruth_-_from_heaven.JPG"} 
          imageOffsetArray={[-0.45, 0.07, 0]} 
          multArray={[1, 1.5, 1.05]}
          backupColour="#c2c2c2" />

        <Box 
          position={9} 
          imageSRC={lowResMode ? lowResImageSRC + "trench_art_-_RULES_FOR_RADICALS.PNG" : highResImageSRC + "trench_art_-_RULES_FOR_RADICALS.JPG"} 
          imageOffsetArray={[-0.32, 0.144, 0]} 
          multArray={[1, 1.7, 1.056]}
          backupColour="#c2c2c2" />

        <Box 
          position={10} 
          imageSRC={lowResMode ? lowResImageSRC + "The_Sythesizer_Rock_Orchestra_-_Orchestral_Rock.PNG" : highResImageSRC + "The_Sythesizer_Rock_Orchestra_-_Orchestral_Rock.JPG"} 
          imageOffsetArray={[-1.8, -0.37, 0]} 
          multArray={[1, 1.5, 0.94]}
          backupColour="#c2c2c2" />

        {/* <OrbitControls /> */}
      </Canvas>
    </div>
  );
}