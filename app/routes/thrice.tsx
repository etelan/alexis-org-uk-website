import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";

const W = 4.25 // x
const H = 2.75 // y
const D = 0.56 // z
const PERIMETER = H + 3*D

// Paints: grey everywhere, then the image squished into the left half
function makeHalfImageTexture(image: HTMLImageElement, offset: number = 0, faceRatio: number[] = [W, H], heightMult: number=1, flip: boolean = false, base: string='#cccccc') {
  const canvasWidth = faceRatio[0] * 1000; 
  const canvasHeight = faceRatio[1] * 1000 / heightMult;

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

function Box() {
  const loaded = useTexture("images/GREEN_REM.JPG"); // waits until the image is ready
  const imageOffsetBack = -0.47
  const imageOffsetTop = 0.1
  const imageOffsetFront = 0
  const imageTopMult = 1.5
  const imageFrontMult = 0.97
  const imageFrontBackupColour = "#c2c2c2"

  const materials = useMemo(() => {
    const plain = () => new THREE.MeshStandardMaterial({ color: "#cccccc" });
    const front = new THREE.MeshStandardMaterial({
      map: makeHalfImageTexture(loaded.image as HTMLImageElement, imageOffsetFront, [W, H], imageFrontMult, true, imageFrontBackupColour),
    });

    const top = new THREE.MeshStandardMaterial({
      map: makeHalfImageTexture(loaded.image as HTMLImageElement, PERIMETER - H + imageOffsetTop, [H, D], imageTopMult, true),
    });

    const back = new THREE.MeshStandardMaterial({
      map: makeHalfImageTexture(loaded.image as HTMLImageElement, PERIMETER + 2*D + imageOffsetBack, [W, H], 1, false),
    });

    // order: right, left, top, bottom, FRONT, back
    return [plain(), plain(), top, plain(), front, back];
  }, [loaded]);

  return (
    <mesh material={materials}>
      <boxGeometry args={[W, H, D]} />
    </mesh>
  );
}

export default function Scene() {
  return (
        <div style={{ width: '100vw', height: '100vh' }}>
          <Canvas camera={{ position: [3, 3, 3], fov: 60 }}>
            <ambientLight intensity={1.5} />
            <scene>
    
            </scene>
            <Box position={[0, 0, 0]} />
            <OrbitControls />
          </Canvas>
        </div>
  );
}