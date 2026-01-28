import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.module.js';

const canvas = document.getElementById('bg-canvas');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.z = 5;

// Crear cubos flotando
const cubes = [];
for(let i=0; i<30; i++){
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color: 0x00a8ff, transparent: true, opacity: 0.5 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set((Math.random()-0.5)*10, (Math.random()-0.5)*10, (Math.random()-0.5)*10);
  cube.rotationSpeed = Math.random()*0.02;
  scene.add(cube);
  cubes.push(cube);
}

// Luz
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5,5,5);
scene.add(light);

// Animación
function animate(){
  requestAnimationFrame(animate);
  cubes.forEach(c => {
    c.rotation.x += c.rotationSpeed;
    c.rotation.y += c.rotationSpeed;
  });
  renderer.render(scene, camera);
}
animate();

// Ajustar al resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
