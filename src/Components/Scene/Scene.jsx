import React, { useEffect, useRef, useCallback } from 'react';
import { Canvas } from 'react-three-fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const MyScene = () => {
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
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const loader = new GLTFLoader();
    loader.load('https://soundcheck-bucket.s3.ap-south-1.amazonaws.com/cube.glb', (gltf) => {
      model.current = gltf.scene;
      scene.add(model.current);
    });

    // Adjust the initial camera position to be away from the cube
    camera.current.position.set(10, 0, 0);
    camera.current.lookAt(0, 0, 0);

    controls.current = new OrbitControls(camera.current, renderer.domElement);
    controls.current.enableDamping = true;
    controls.current.dampingFactor = 0.25;
    controls.current.screenSpacePanning = false;
    controls.current.maxPolarAngle = Math.PI / 2;

    // Delay the camera animation by 2 seconds
    setTimeout(() => {
      // Animate the camera to the desired position
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
    }, 2000); // 2 seconds delay

    const handleKeyPress = (event) => {
      switch (event.key) {
        case '1':
          handleNavigation(new THREE.Vector3(3.5, 0, 0));
          break;
        case 'L':
          console.log('Camera Position:', camera.current.position.toArray());
          break;
        case '2':
          handleNavigation(new THREE.Vector3(-3.5, 0, 0));
          break;
        case '3':
          handleNavigation(new THREE.Vector3(0, 0, 3.5));
          break;
        case '4':
          handleNavigation(new THREE.Vector3(0, 0, -3.5));
          break;
        default:
          break;
      }
    };

    const handleResize = () => {
      const newAspect = window.innerWidth / window.innerHeight;
      camera.current.aspect = newAspect;
      camera.current.updateProjectionMatrix();
      renderer.setPixelRatio(window.devicePixelRatio)

      // Adjust model scale based on the screen size
      const scale = window.innerWidth / 1000; // Adjust the scale factor as needed
      model.current.scale.set(scale, scale, scale);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', handleKeyPress);

    const animate = () => {
      controls.current.update();
      renderer.render(scene, camera.current);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleNavigation]);

  return null; // No need to return anything from MyScene
};

// Outside of MyScene component, create a single Canvas component
const App = () => {
  return (
    <Canvas style={{ position: 'absolute', top: 0, left: 0 }}>
      <MyScene />
    </Canvas>
  );
};

export default App;
