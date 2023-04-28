import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { useGLTF, Edges, Html } from "@react-three/drei";
import { EffectComposer, Outline, Select } from "@react-three/postprocessing";
import { useThree, useFrame } from "@react-three/fiber";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { saveAs } from "file-saver";
import { useDispatch } from "react-redux";
import { Box3, Vector3, MeshStandardMaterial } from "three";

import { colorType1, colorType2, colorType3 } from "@/assets";
import Link from "next/link";

const gltfFile = "/models/gltf/residence.glb";
const ResidenceModel = React.forwardRef((props, ref) => {
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const [meshInfo, setMeshInfo] = useState("1F");
  const [floor, setFloor] = useState(1);
  const groupRef = useRef(null);
  const meshRef = useRef(null);
  // dispatch model data to redux
  const dispatch = useDispatch();
  //导入模型
  const { nodes, scene, material, parser } = useGLTF(gltfFile);
  const gltfModel = scene;
  const box = new Box3().setFromObject(gltfModel);
  const center = box.getCenter(new Vector3());
  const meshArr = Object.values(nodes).filter((n) => n.type === "Mesh");
  const meshArrName = meshArr.map((item) => item.name.split("_")[0]);
  //去重
  const meshNameArr = Array.from(new Set(meshArrName));

  const meshMaterialArr = meshArr.map((item) => item.material);
  const meshMaterialName = meshMaterialArr.map((item) => item.name);
  const meshMaterialNameArr = Array.from(new Set(meshMaterialName));

  // const meshInfo = [];
  // const meshInfoPosition = [];
  // console.log("meshInfo", meshInfo);
  // console.log(typeof meshInfo);
  const matches = meshInfo?.match(/\d+/);
  useEffect(() => {
    if (matches != null && matches.length > 0) {
      setFloor(parseInt(matches[0]));
      // console.log("floor", floor);
    }
  }, [matches, meshInfo]);

  let timeout;

  const colorType = colorType3;
  gltfModel.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      Object.keys(colorType).map((key, index) => {
        if (child.material.name === key) {
          child.material.color.set(colorType[key]);
        }
      });
    }
  });
  useFrame(() => {});

  const highlightMaterial = new MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 1.0,
    transparent: true,
    opacity: 0.5,
  });

  const groups = [];

  // 遍历模型中的group
  gltfModel.traverse((child) => {
    if (child.isGroup) {
      groups.push(child);
      child.children.forEach((mesh) => {
        if (mesh.isMesh) {
          mesh.userData.originalMaterial = mesh.material;
        }
      });
    }
  });

  // 在移入网格的事件处理程序中
  // const handlePointerOver = (e) => {
  // };

  // 在移出网格的事件处理程序中
  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHover(false);
    const group = e.object.parent;
    if (group.isGroup) {
      group.children.forEach((child) => {
        if (child.isMesh) {
          child.material = child.userData.originalMaterial;
        }
      });
    }
  };
  useEffect(() => {
    // console.log("meshInfo", meshInfo);
    dispatch({
      type: "SET_MODEL_INFO",
      payload: meshInfo,
    });
  }, [dispatch, meshInfo]);

  return (
    <>
      <group {...props} dispose={null} ref={groupRef}>
        {meshNameArr.map((meshName, index) => {
          return (
            <group
              key={index}
              name={meshName}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHover(true);
                const group = e.object.parent;
                // console.log("group", group);
                if (group.isGroup) {
                  group.children.forEach((child) => {
                    if (child.isMesh) {
                      child.material = highlightMaterial.clone();
                    }
                  });
                  const meshInfoItem = meshName;
                  // setMeshInfo(meshInfoItem);
                  clearTimeout(timeout);
                  timeout = setTimeout(() => {
                    setMeshInfo(meshInfoItem);
                  }, 100);
                  // console.log("meshInfo", meshInfo);
                }
              }}
              onPointerOut={handlePointerOut}
              onClick={(e) => {
                e.stopPropagation();
                // console.log("meshName", meshName);
              }}
            >
              {meshArr
                .filter((v) => v.name.split("_")[0] === meshName)
                .map((meshItem, index) => {
                  return (
                    <mesh
                      key={meshItem.uuid}
                      geometry={meshItem.geometry}
                      material={meshItem.material}
                      position={meshItem.position}
                      name={meshName}
                      userData={meshItem.userData}
                      ref={meshRef}
                      castShadow
                      receiveShadow
                    >
                      {/* <Html
                        position={[
                          11,
                          meshItem.name.match(/\d+/) * 2.87 - 1,
                          -8,
                        ]}
                        rotation={[0, Math.PI / 2, 0]}
                        transform
                      >
                        <Link href='/residence'>
                          <div className='text-xl p-4 bg-gray-200 rounded-xl'>
                            <p>{hovered ? meshName : ""}</p>
                          </div>
                        </Link>
                      </Html> */}
                    </mesh>
                  );
                })}
            </group>
          );
        })}
        <primitive object={scene} {...props} castShadow receiveShadow />
      </group>
      <Html position={[20, floor * 2.9 + 1, 0]}>
        <div className="w-8 h-8 bg-blue-500 rounded-full animate-ping infinite"></div>
      </Html>
      <Html position={[20, floor * 2.9 + 1, 0]}>
        <Link
          href={`/residence/canvas/ResidenceCanvas${
            floor % 2 === 0 ? "02" : "01"
          }`}
        >
          <div
            className="text-xs p-2 bg-blue-300 rounded-full
          transport opacity-50
          hover:bg-blue-700 hover:text-white"
          >
            <p>
              {/* {floor} */}
              {/* {hovered ? meshInfo : ""} */}
              {meshInfo}
            </p>
          </div>
        </Link>
      </Html>
      {/* <Html
        position={[11, meshRef.current?.name.match(/\d+/) * 2.87 - 1, -8]}
        rotation={[0, Math.PI / 2, 0]}
        transform
      >
        <Link href='/residence/canvas/ResidenceCanvas01'>
          <div className='text-xl p-4 bg-gray-200 rounded-xl'>
            <p>{meshInfo}</p>
          </div>
        </Link>
      </Html> */}
    </>
  );
});

export default ResidenceModel;
ResidenceModel.displayName = "ResidenceModel";

useGLTF.preload(gltfFile, true, true);
