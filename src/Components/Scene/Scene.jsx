import React, { useEffect, useRef, useCallback } from 'react';
import { Canvas } from 'react-three-fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Clock } from 'three/src/core/Clock';

const Navbar = ({ handleNavigation, mySceneRef }) => {
  const buttonStyles = {
    backgroundColor: "black",
    color: "white",
    width: "20vw",
    fontFamily: "Roboto, sans-serif",
  };

  const navbarStyle = { 
    position: 'absolute',
    top: "1.5vh", 
    left: 0, 
    zIndex: 1,
    marginLeft:"10vw",
    marginBottom:"2vh",
    height:"5vh"
   }

  const handleButtonClick = (targetPosition) => {
    const { camera, controls } = mySceneRef.current;
    handleNavigation(targetPosition, camera, controls);
  };

  return (
    <div style={navbarStyle}>
      <button style={buttonStyles} onClick={() => handleButtonClick(new THREE.Vector3(3.5, 0, 0))}>About</button>
      <button style={buttonStyles} onClick={() => handleButtonClick(new THREE.Vector3(-3.5, 0, 0))}>Football</button>
      <button style={buttonStyles} onClick={() => handleButtonClick(new THREE.Vector3(0, 0, 3.5))}>Skills</button>
      <button style={buttonStyles} onClick={() => handleButtonClick(new THREE.Vector3(0, 0, -3.5))}>Projects</button>
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

  const rotateCamera = () => {
    const clock = new Clock();
    const rotationSpeed = 0.1;

    const animateRotation = () => {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Adjust the rotation here, for example, rotate around the Y-axis
      camera.current.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationSpeed * delta);

      controls.current.update();

      requestAnimationFrame(animateRotation);
    };

    animateRotation();
  };


  useEffect(() => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(innerWidth, innerHeight);
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
    rotateCamera();
    const animate = () => {
      controls.current.update();
      renderer.render(scene, camera.current);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
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
      <Canvas style={{ position: 'absolute', top: "6.5vh", left: 0, width: '100%', height: '93.5%' }}>
        <MyScene ref={mySceneRef} />
      </Canvas>
    </>
  );
};

export default App;