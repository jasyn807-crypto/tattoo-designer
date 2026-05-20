import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

const VirtualTryOnPage = () => {
    const containerRef = useRef();
    const cameraRef = useRef();
    const sceneRef = useRef();
    const rendererRef = useRef();
    const meshRef = useRef();
    const controlsRef = useRef();
    const controllerRef = useRef();

    useEffect(() => {
        const currentContainer = containerRef.current;
        if (!currentContainer) return;

        const init = () => {
            sceneRef.current = new THREE.Scene();

            cameraRef.current = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

            rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            rendererRef.current.setPixelRatio(window.devicePixelRatio);
            rendererRef.current.setSize(window.innerWidth, window.innerHeight);
            rendererRef.current.xr.enabled = true;
            currentContainer.appendChild(rendererRef.current.domElement);

            const arButton = ARButton.createButton(rendererRef.current, { optionalFeatures: ['dom-overlay', 'dom-overlay-for-handheld-ar'] });
            document.body.appendChild(arButton);

            // Setup TransformControls
            controlsRef.current = new TransformControls(cameraRef.current, rendererRef.current.domElement);
            controlsRef.current.addEventListener('dragging-changed', (event) => {
                rendererRef.current.xr.enabled = !event.value; // Disable AR session during dragging
            });
            sceneRef.current.add(controlsRef.current);

            const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
            light.position.set(0.5, 1, 0.25);
            sceneRef.current.add(light);

            controllerRef.current = rendererRef.current.xr.getController(0);
            controllerRef.current.addEventListener('select', onSelect);
            sceneRef.current.add(controllerRef.current);

            window.addEventListener('resize', onWindowResize);
        };

        const onSelect = () => {
            if (controllerRef.current.userData.isSelecting === true) return;

            if (meshRef.current) {
                // If a mesh exists, attach controls to it for manipulation
                controlsRef.current.attach(meshRef.current);
                controllerRef.current.userData.isSelecting = true;
            } else {
                // If no mesh, maybe place a default object or log
                console.log('No tattoo to select/place yet.');
            }
        };

        const onWindowResize = () => {
            cameraRef.current.aspect = window.innerWidth / window.innerHeight;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        };

        const animate = () => {
            rendererRef.current.setAnimationLoop(render);
        };

        const render = () => {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        };

        init();
        animate();

        return () => {
            // Cleanup
            rendererRef.current.setAnimationLoop(null);
            if (currentContainer && rendererRef.current.domElement) {
                currentContainer.removeChild(rendererRef.current.domElement);
            }
            const arButton = document.querySelector('.ar-button');
            if (arButton && document.body.contains(arButton)) {
                document.body.removeChild(arButton);
            }
            window.removeEventListener('resize', onWindowResize);
            if (controllerRef.current) {
                controllerRef.current.removeEventListener('select', onSelect);
            }
            if (controlsRef.current) {
                controlsRef.current.dispose();
            }
        };
    }, []);

    // Function to load and display the tattoo image
    const loadTattoo = (imageFile) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Create a texture from the image
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(e.target.result, (texture) => {
                const aspectRatio = texture.image.width / texture.image.height;
                const planeHeight = 0.1; // Base height for the tattoo
                const planeWidth = planeHeight * aspectRatio;

                const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
                const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
                meshRef.current = new THREE.Mesh(geometry, material);
                meshRef.current.position.set(0, 0, -0.5); // Position in front of the camera
                sceneRef.current.add(meshRef.current);
                controlsRef.current.attach(meshRef.current); // Attach controls immediately after loading
            });
        };
        reader.readAsDataURL(imageFile);
    };

    // Placeholder for tattoo selection (e.g., from an input type="file")
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            loadTattoo(file);
        }
    };

    const handleCapture = () => {
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
            const dataURL = rendererRef.current.domElement.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = dataURL;
            a.download = 'ar-tattoo.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    return (
        <div ref={containerRef} style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', zIndex: 10 }}>
                <h1>Virtual Try-On</h1>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                <button onClick={() => controlsRef.current.setMode('translate')} style={{ margin: '5px' }}>Move</button>
                <button onClick={() => controlsRef.current.setMode('rotate')} style={{ margin: '5px' }}>Rotate</button>
                <button onClick={() => controlsRef.current.setMode('scale')} style={{ margin: '5px' }}>Scale</button>
                <button onClick={handleCapture} style={{ margin: '5px' }}>Capture Photo</button>
            </div>
        </div>
    );
};

export default VirtualTryOnPage;