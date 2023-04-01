/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 tree.glb
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function CityModel01(props) {
  const { nodes, materials, scene } = useGLTF("models/city/model01.glb");

  console.log("treeScene", scene);

  return (
    <group {...props} dispose={null}>
      <primitive
        object={scene}
        {...props}
        castShadow
        receiveShadow
        onClick={(e) => console.log("click")}
      />
    </group>
  );
}

useGLTF.preload("models/city/model01.glb");
