
import React from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ModelViewer = ({ modelPath }) => {
  const gltf = useLoader(GLTFLoader, modelPath);
  return (
    <primitive object={gltf.scene} scale={1} />
  );
};

export default ModelViewer;