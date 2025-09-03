import gsap from "gsap";
import * as THREE from "three";
import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";
import atmosphereVertexShader from "../shaders/atmosphereVertex.glsl";
import atmosphereFragmentShader from "../shaders/atmosphereFragment.glsl";
import europe from "../europe.jpg";
const canvasContainer = document.querySelector("#canvasContainer");

const scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
  75,
  canvasContainer.offsetWidth / canvasContainer.offsetHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("canvas"),
});

renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      globeTexture: {
        value: new THREE.TextureLoader().load(europe),
      },
    },
  })
);

const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  })
);
atmosphere.scale.set(1.1, 1.1, 1.1);
scene.add(atmosphere);
const group = new THREE.Group();
group.add(sphere);
scene.add(group);

const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  color: "#FFA500",
});
const starVertices = [];
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 1500;
  const y = (Math.random() - 0.5) * 1500;
  const z = -Math.random() * 1500;
  starVertices.push(x, y, z);
}
starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starVertices, 3)
);
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

camera.position.z = 15;

const box = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 0.2, 1.8),
  new THREE.MeshBasicMaterial({
    color: "#FFA500",
  })
);
const radius = 5;
const latitude = (-65 / 180) * Math.PI;
const longitude = (70 / 180) * Math.PI;
const x = radius * Math.cos(latitude) * Math.sin(longitude);
const y = radius * Math.sin(latitude);
const z = radius * Math.cos(latitude) * Math.cos(longitude);
box.position.z = z;
box.position.y = y;
box.position.x = x;
box.lookAt(0, 0, 0);
box.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.9));
group.add(box);
gsap.to(box.scale, {
  z: 1.4,
  x: 0.4,
  y: 0.4,
  duration: 1,
  opacity: 1,
  yoyo: true,
  repeat: -1,
  ease: "linear",
});

sphere.rotation.y = -Math.PI / 2;
const mouse = {
  x: undefined,
  y: undefined,
};

const popUpEl = document.querySelector("#popUpEl");

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  group.rotation.y += 0.002;

  if (mouse.x) {
    gsap.to(group.rotation, {
      x: -mouse.y * 0.5,
      y: mouse.x * 0.7,
      duration: 2,
    });
  }
}
animate();

addEventListener("mousemove", (event) => {
  mouse.x = ((event.clientX - innerWidth / 2) / (innerWidth / 2)) * 2 - 1;
  mouse.y = (event.clientY / innerHeight) * 2 + 1;

  gsap.set(popUpEl, {
    x: event.clientX,
    y: event.clientY,
  });
});
addEventListener("resize", () => {
  renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
  camera = new THREE.PerspectiveCamera(
    75,
    canvasContainer.offsetWidth / canvasContainer.offsetHeight,
    0.1,
    1000
  );

  camera.position.z = 15;
});
