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
    console.log("offset " + offset)
    console.log("normal height " + image.height)


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
  const loaded = useTexture("images/DX20V_WAVE.JPG"); // waits until the image is ready

  const materials = useMemo(() => {
    const plain = () => new THREE.MeshStandardMaterial({ color: "#cccccc" });
    const front = new THREE.MeshStandardMaterial({
      map: makeHalfImageTexture(loaded.image as HTMLImageElement, 0, [W, H], 1, true),
    });

    const top = new THREE.MeshStandardMaterial({
      map: makeHalfImageTexture(loaded.image as HTMLImageElement, PERIMETER - H +0.25, [H, D], 2, true),
    });

    const back = new THREE.MeshStandardMaterial({
      map: makeHalfImageTexture(loaded.image as HTMLImageElement, PERIMETER + 2*D, [W, H], 1),
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