import React, { Suspense, useEffect, useRef, useState } from "react";
import { OrbitControls, Plane, useGLTF } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { EffectComposer, SMAA, SSAO } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { extend, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { Box3, Box3Helper, Group, Object3D, Vector3 } from "three";

import { ResidenceModel } from "@/components/importModels";
import { colorType1, colorType2, colorType3 } from "@/assets";

const ResidenceCanvas = () => {
  return (
    <Canvas shadows camera={{ position: [100, 200, 100], fov: 45, far: 2000 }}>
      <OrbitControls />
      <Suspense>
        {/* 坏境光 */}
        <ambientLight intensity={0.8} />
        {/* 平行光 */}
        <directionalLight
          castShadow
          intensity={1.5}
          position={[50, 300, 50]}
          shadow-mapSize={4096}
          // shadow-mapSize={[4096, 4096]}
          // shadow-bias={-0.0005}
          color={"#fff"}
        >
          <orthographicCamera
            attach='shadow-camera'
            args={[-200, 200, 200, -200, 10, 1000]}
            // args={[-100, 100, 100, -100]}
          />
        </directionalLight>
        {/* <ambientLight intensity={0.5} /> */}
        {/* <spotLight position={[10, 15, 10]} angle={0.15} penumbra={1} /> */}
        {/* <pointLight position={[10, 15, 10]} /> */}
        {/* <fog attach='fog' args={["white", 15, 150]} /> */}
        {/* <axesHelper args={[10]} /> */}
        <gridHelper args={[80, 20]} />
        {/* <Plane args={[20, 10]} /> */}
        {/* <mesh receiveShadow position={[0, 0, 0]} castShadow>
          <boxGeometry attach='geometry' args={[20, 0.01, 20]} />
          <meshStandardMaterial attach='material' color={"#FFFFFF"} />
        </mesh> */}
        <ResidenceModel />

        <EffectComposer>
          <SSAO
            blendFunction={BlendFunction.MULTIPLY} // blend mode
            samples={64} // amount of samples per pixel (shouldn't be a multiple of the ring count)
            rings={4} // amount of rings in the occlusion sampling pattern
            distanceThreshold={1.0} // global distance threshold at which the occlusion effect starts to fade out. min: 0, max: 1
            distanceFalloff={0.0} // distance falloff. min: 0, max: 1
            rangeThreshold={0.5} // local occlusion range threshold at which the occlusion starts to fade out. min: 0, max: 1
            rangeFalloff={0.1} // occlusion range falloff. min: 0, max: 1
            luminanceInfluence={0.9} // how much the luminance of the scene influences the ambient occlusion
            radius={20} // occlusion sampling radius
            scale={0.5} // scale of the ambient occlusion
            bias={0.1} // occlusion bias
            intensity={12}
          />
          <SMAA />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
};

export default ResidenceCanvas;
