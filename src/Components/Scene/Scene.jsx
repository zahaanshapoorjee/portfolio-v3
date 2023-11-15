import React, { useEffect, useRef, useCallback } from 'react';
import { Canvas } from 'react-three-fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const Navbar = ({ handleNavigation, mySceneRef }) => {
  const handleButtonClick = (targetPosition) => {
    const { camera, controls } = mySceneRef.current;
    handleNavigation(targetPosition, camera, controls);
  };

  return (
    <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
      <button onClick={() => handleButtonClick(new THREE.Vector3(3.5, 0, 0))}>About</button>
      <button onClick={() => handleButtonClick(new THREE.Vector3(-3.5, 0, 0))}>Football</button>
      <button onClick={() => handleButtonClick(new THREE.Vector3(0, 0, 3.5))}>Skills</button>
      <button onClick={() => handleButtonClick(new THREE.Vector3(0, 0, -3.5))}>Projects</button>
    </div>
  );
};

const MyScene = React.forwardRef((props, ref) => {
  const camera = useRef(new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000));
  const controls = useRef(null);
  const model = useRef(null);

  const handleNavigation = useCallback((targetPosition) => {
    const startPosition = camera.current.position.clone();
    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const progress = Math.min((currentTime - startTime) / duration, 1);

      camera.current.position.lerpVectors(startPosition, targetPosition, progress);
      controls.current.update();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, []);

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    // Explicitly set the canvas size using window dimensions
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    renderer.setSize(canvasWidth, canvasHeight);

    // Explicitly set the pixel ratio for better control over rendering quality
    const pixelRatio = window.devicePixelRatio || 1;
    renderer.setPixelRatio(pixelRatio);

    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const loader = new GLTFLoader();
    loader.load('https://soundcheck-bucket.s3.ap-south-1.amazonaws.com/cube.glb', (gltf) => {
      model.current = gltf.scene;
      scene.add(model.current);
    });

    camera.current.position.set(10, 0, 0);
    camera.current.lookAt(0, 0, 0);

    controls.current = new OrbitControls(camera.current, renderer.domElement);
    controls.current.enableDamping = true;
    controls.current.dampingFactor = 0.25;
    controls.current.screenSpacePanning = false;
    controls.current.maxPolarAngle = Math.PI / 2;

    setTimeout(() => {
      const targetPosition = new THREE.Vector3(3.5, 0, 0);
      const duration = 3000;
      const startTime = Date.now();

      const animateCameraIn = () => {
        const currentTime = Date.now();
        const progress = Math.min((currentTime - startTime) / duration, 1);

        camera.current.position.lerpVectors(camera.current.position, targetPosition, progress);
        controls.current.update();

        if (progress < 1) {
          requestAnimationFrame(animateCameraIn);
        }
      };

      animateCameraIn();
    }, 2000);

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      // Update renderer size and aspect ratio
      renderer.setSize(newWidth, newHeight);
      camera.current.aspect = newWidth / newHeight;
      camera.current.updateProjectionMatrix();
    };

    const animate = () => {
      controls.current.update();
      renderer.render(scene, camera.current);
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleNavigation]);

  React.useImperativeHandle(ref, () => ({
    camera,
    controls,
  }));

  return null;
});

const App = () => {
  const mySceneRef = useRef();

  const handleNavigation = useCallback((targetPosition, camera, controls) => {
    const startPosition = camera.current.position.clone();
    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const progress = Math.min((currentTime - startTime) / duration, 1);

      camera.current.position.lerpVectors(startPosition, targetPosition, progress);
      controls.current.update();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, []);

  return (
    <>
      <Navbar handleNavigation={handleNavigation} mySceneRef={mySceneRef} />
      <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <MyScene ref={mySceneRef} />
      </Canvas>
    </>
  );
};

export default App;
