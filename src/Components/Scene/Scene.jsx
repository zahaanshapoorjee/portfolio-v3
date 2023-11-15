import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Canvas } from 'react-three-fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Clock } from 'three/src/core/Clock';



const Navbar = ({ handleNavigation, mySceneRef }) => {
  const buttonStyles = {
    backgroundColor: "Transparent",
    color: "white",
    width: "20vw",
    fontFamily: "Lato",
    border: "none"
  };

  const navbarStyle = { 
    position: 'absolute',
    top: "1.5vh", 
    left: 0, 
    zIndex: 1,
    marginLeft:"10vw",
    marginRight:"10vw",
    height:"5vh",
    width:"80vw"
   }

  const handleButtonClick = (targetPosition) => {
    const { camera, controls } = mySceneRef.current;
    controls.current.autoRotate = false;
    handleNavigation(targetPosition, camera, controls);
  };

  return (
    <div style={navbarStyle}>
      <button style={buttonStyles} onClick={() => handleButtonClick(new THREE.Vector3(3.5, 0, 0))}>About Me</button>
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
    const duration = 5000;
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
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(innerWidth, innerHeight);
    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const loader = new GLTFLoader();
    loader.load('./ZAHAANCUBE.glb', (gltf) => {
      model.current = gltf.scene;
      scene.add(model.current);
    });

    camera.current.position.set(7.5, 0, 0);
    camera.current.lookAt(0, 0, 0);

    controls.current = new OrbitControls(camera.current, renderer.domElement);
    controls.current.enableDamping = true;
    controls.current.dampingFactor = 0.25;
    controls.current.screenSpacePanning = false;
    controls.current.maxPolarAngle = Math.PI / 2;
    controls.current.autoRotate = true;
    controls.current.autoRotateSpeed = 3.0; 

    const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const handleMouseMove = (event) => {
    // Calculate normalized device coordinates (NDC) from mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the mouse position
    raycaster.setFromCamera(mouse, camera.current);

    // Check for intersections
    const intersects = raycaster.intersectObjects([model.current], true);
    if (intersects.length > 0) {
      controls.current.autoRotate = false;
    }
    else
    {
      controls.current.autoRotate = true;
    }
  };

  // Add event listener for mouse move
  window.addEventListener('mousemove', handleMouseMove);

    setTimeout(() => {
      const targetPosition = new THREE.Vector3(3.5, 0, 0);
      const duration = 500;
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
    <div style={{display:"flex", justifyContent:"center"}}>
      <Navbar handleNavigation={handleNavigation} mySceneRef={mySceneRef} />
      <Canvas style={{ position: 'absolute', top: "6.5vh", left: 0, width: '100%', height: '93.5%' }}>
        <MyScene ref={mySceneRef} />
      </Canvas>
    </div>
  );
};

export default App;