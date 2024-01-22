import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import firefliesVertexShader from "./shaders/fireflies/vertex.glsl";
import firefliesFragmentShader from "./shaders/fireflies/fragment.glsl";
import fairyVertexShader from "./shaders/fairy/vertex.glsl";
import fairyFragmentShader from "./shaders/fairy/fragment.glsl";
import portalVertexShader from "./shaders/portal/vertex.glsl";
import portalFragmentShader from "./shaders/portal/fragment.glsl";
import fairyTailVertexShader from "./shaders/fairyTail/vertex.glsl";
import fairyTailFragmentShader from "./shaders/fairyTail/fragment.glsl";

// /**
//  * Spector JS
//  */
// const SPECTOR = require('spectorjs')
// const spector = new SPECTOR.Spector()
// spector.displayUI()

/**
 * Base
 */
// Debug

const debugObject = {};

const gui = new GUI({
  width: 400,
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader();

// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("draco/");

// GLTF loader
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Textures
 */
const bakedTexture = textureLoader.load("baked.jpg");
bakedTexture.flipY = false;
bakedTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

// Portal light material
const portalLightMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColorStart: { value: new THREE.Color("#201919") },
    uColorEnd: { value: new THREE.Color("#ffffff") },
  },
  vertexShader: portalVertexShader,
  fragmentShader: portalFragmentShader,
});

// Pole light material
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 });

/**
 * Model
 */
gltfLoader.load("portal.glb", (gltf) => {
  const bakedMesh = gltf.scene.children.find((child) => child.name === "baked");
  const portalLightMesh = gltf.scene.children.find(
    (child) => child.name === "portalLight"
  );
  const poleLightAMesh = gltf.scene.children.find(
    (child) => child.name === "poleLightA"
  );
  const poleLightBMesh = gltf.scene.children.find(
    (child) => child.name === "poleLightB"
  );

  bakedMesh.material = bakedMaterial;
  portalLightMesh.material = portalLightMaterial;
  poleLightAMesh.material = poleLightMaterial;
  poleLightBMesh.material = poleLightMaterial;

  scene.add(gltf.scene);
});

/**
 * Fireflies
 **/

// Geometry
const firefliesGeometry = new THREE.BufferGeometry();
const firefliesCount = 30;
const positionArray = new Float32Array(firefliesCount * 3);
const scaleArray = new Float32Array(firefliesCount);
const randomnessArray = new Float32Array(firefliesCount);

for (let i = 0; i < firefliesCount; i++) {
  positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4;
  positionArray[i * 3 + 1] = Math.random() * 1.5;
  positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;

  scaleArray[i] = Math.random();
  randomnessArray[i] = Math.random() * 3.0;
}

firefliesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);

firefliesGeometry.setAttribute(
  "aScale",
  new THREE.BufferAttribute(scaleArray, 1)
);

firefliesGeometry.setAttribute(
  "aRandomness",
  new THREE.BufferAttribute(randomnessArray, 1)
);

// Material
const firefliesMaterial = new THREE.ShaderMaterial({
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  uniforms: {
    uTime: { value: 0 },
    uSize: { value: 200 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
  },
  vertexShader: firefliesVertexShader,
  fragmentShader: firefliesFragmentShader,
});

gui
  .add(firefliesMaterial.uniforms.uSize, "value")
  .min(5)
  .max(400)
  .step(1)
  .name("Fireflies Size");

debugObject.portalColorStart = "#201919";
debugObject.portalColorEnd = "#ffffff";

gui
  .addColor(debugObject, "portalColorStart")
  .onChange(() => {
    portalLightMaterial.uniforms.uColorStart.value.set(
      debugObject.portalColorStart
    );
  })
  .name("Portal Color Start");
gui
  .addColor(debugObject, "portalColorEnd")
  .onChange(() => {
    portalLightMaterial.uniforms.uColorEnd.value.set(
      debugObject.portalColorEnd
    );
  })
  .name("Portal Color End");

// Points
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);
scene.add(fireflies);

/**
 * Fairy
 **/

// Geometry
const fairyGeometry = new THREE.BufferGeometry();
const positionFairyArray = new Float32Array(3);

positionFairyArray[0] = -0.2;
positionFairyArray[1] = 0.84;
positionFairyArray[2] = 0.25;

fairyGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionFairyArray, 3)
);

// firefliesGeometry.setAttribute(
//   "aScale",
//   new THREE.BufferAttribute(scaleArray, 1)
// );

// Material
const fairyMaterial = new THREE.ShaderMaterial({
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  uniforms: {
    uTime: { value: 0 },
    uSize: { value: 200 },
    uColor: { value: new THREE.Color("#ffffff") },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
  },
  vertexShader: fairyVertexShader,
  fragmentShader: fairyFragmentShader,
});

debugObject.fairyColor = "#ffffff";
let positionControls = {
  x: -0.2,
  y: 0.84,
  z: 0.25,
};

// Añades controles para x e y en tu GUI
gui.add(positionControls, "x", -5, 5, 0.01).onChange((newValue) => {
  fairyGeometry.attributes.position.array[0] = newValue;
  fairyGeometry.attributes.position.needsUpdate = true;
});

gui.add(positionControls, "y", -5, 5, 0.01).onChange((newValue) => {
  fairyGeometry.attributes.position.array[1] = newValue;
  fairyGeometry.attributes.position.needsUpdate = true;
});

gui.add(positionControls, "z", -5, 5, 0.01).onChange((newValue) => {
  fairyGeometry.attributes.position.array[2] = newValue;
  fairyGeometry.attributes.position.needsUpdate = true;
});
gui
  .add(fairyMaterial.uniforms.uSize, "value")
  .min(5)
  .max(500)
  .step(1)
  .name("Fairy Size");

gui
  .addColor(debugObject, "fairyColor")
  .onChange(() => {
    fairyMaterial.uniforms.uColor.value.set(debugObject.fairyColor);
  })
  .name("Fairy Color");

// Point
const fairy = new THREE.Points(fairyGeometry, fairyMaterial);
scene.add(fairy);

/**
 * Fairy tail
 **/

// Geometry
const fairyTailGeometry = new THREE.BufferGeometry();
const fairyTailCount = 90;
const positionFairyTailArray = new Float32Array(fairyTailCount);
const randomnessFairyTailArray = new Float32Array(fairyTailCount);

for (let i = 0; i < fairyTailCount; i++) {
  positionFairyTailArray[i * 3 + 0] = -0.2 + (Math.random() - 0.5) * 0.25;
  positionFairyTailArray[i * 3 + 1] = 0.84 + (Math.random() - 1.5) * 0.05;
  positionFairyTailArray[i * 3 + 2] = 0.25 + (Math.random() - 0.5) * 0.25;

  randomnessFairyTailArray[i] = Math.random() * 0.1;
}
console.log(randomnessFairyTailArray);
fairyTailGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionFairyTailArray, 3)
);

fairyTailGeometry.setAttribute(
  "aRandomness",
  new THREE.BufferAttribute(randomnessFairyTailArray, 3)
);

// Material
const fairyTailMaterial = new THREE.ShaderMaterial({
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  uniforms: {
    uTime: { value: 0 },
    uSize: { value: 10 },
    uColor: { value: new THREE.Color("#ffffff") },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
  },
  vertexShader: fairyTailVertexShader,
  fragmentShader: fairyTailFragmentShader,
});

// Point
const fairyTail = new THREE.Points(fairyTailGeometry, fairyTailMaterial);
scene.add(fairyTail);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Update fireflies
  firefliesMaterial.uniforms.uPixelRatio.value = Math.min(
    window.devicePixelRatio,
    2
  );
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

debugObject.clearColor = "#201919";
renderer.setClearColor(debugObject.clearColor);
gui.addColor(debugObject, "clearColor").onChange(() => {
  renderer.setClearColor(debugObject.clearColor);
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update fireflies
  firefliesMaterial.uniforms.uTime.value = elapsedTime;

  // Update portal light
  portalLightMaterial.uniforms.uTime.value = elapsedTime;

  // Update fairy
  fairyMaterial.uniforms.uTime.value = elapsedTime;

  // Update fairy tail
  fairyTailMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
