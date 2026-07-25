function exportarHTML() {
  let template = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${game_name.value}</title>

    <style>
    /* API */
.btn {
    color: blue;
    border-radius: 5px;
    background: skyblue;
    border-color: blue;
}

@import url('https://fonts.googleapis.com/css2?family=Cascadia+Code:ital,wght@0,200..700;1,200..700&display=swap');

@keyframes pulso {
 0%, 100% { transform: translateY(0); }
 50% { transform: translateY(-10px); }
}

* {
  font-family: "Cascadia Code", sans-serif;
  box-sizing: border-box;
}

#toolbar {
  background: linear-gradient(#3E4055, #191A22);
}

#createObject {
  background: #FFFFFF;
  border-radius: 7px;
  width: 300px;
  height: 200px;
  display: none;
}

html {
  background: #2B2C35;
}

#view3d, #view2d {
  position: absolute;
  top: 0;
  left: 0;
  width: 360px;
  height: 250px;
}

#view3d { z-index: 1; background: black; }
#view2d { z-index: 2; background: transparent; pointer-events: none; }

#loader{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  color: white;
  background-color: ${optionalColor.value};
  background-size: 200% 200%;
}

#ltxt {
  color: white;
  font-size: 20px;
  font-weight: bold;
  text-shadow: 
    2px 0 0 black,
    -2px 0 0 black, 
    0 2px 0 black, 
    0 -2px 0 black;
  animation: pulso 1s ease-in-out infinite;
}

@media (max-width: 1024px) {
  #createObject {
    width: 450px;
    height: 280px;
  }
  #view3d, #view2d {
    width: 300px;
    height: 200px;
  }
  #ltxt {
    font-size: 18px;
  }
}

@media (max-width: 768px) {
  #createObject {
    width: 90%;
    height: 160px;
  }
  #view3d, #view2d {
    width: 100vw;
    height: 50vh;
  }
  #ltxt {
    font-size: 16px;
    text-shadow: 
      1px 0 0 black,
      -1px 0 0 black, 
      0 1px 0 black, 
      0 -1px 0 black;
  }
  #loader {
    background-image: repeating-linear-gradient(135deg, rgba(255, 133, 14, 0.9) 0px, rgba(255, 133, 14, 0.9) 10px, transparent 10px, transparent 20px);
    background-size: 150% 150%;
  }
}

@media (max-width: 480px) {
  #createObject {
    width: 95%;
    height: 140px;
  }
  #ltxt {
    font-size: 14px;
  }
}
    </style>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/dracula.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/hint/show-hint.min.css">
</head>
<body>

  <script src="https://unpkg.com/three@0.140.0/build/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.140.2/examples/js/controls/OrbitControls.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.140.0/examples/js/loaders/GLTFLoader.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script src="https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js"></script>

    <canvas id="view3d"></canvas>
    <canvas id="view2d"></canvas>
  
  <div id="loader">
    <img src="./assets/logooo.png" width="200px" height="200px">
    <p id="ltxt">${ot.value}</p>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/python/python.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/edit/closebrackets.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/edit/matchbrackets.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/selection/active-line.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/hint/show-hint.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/hint/anyword-hint.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/hint/python-hint.min.js"></script>
  
  <script>
  let code = "${editor.getValue()}";

  function onCollideCircle2d(x1, y1, x2, y2) {
    let distance = Math.sqrt((x1 - y1)**2 + (x2 - y2)**2);
    if (distance < 5) return true;
}

function onCollideSquare2d(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 and x1 + w1 > x2 and y1 < y2 + h2 and y1 + h1 > y2;
}
    const canvas2d = document.getElementById('view2d');
    const ctx = canvas2d.getContext('2d');

    canvas2d.width = window.innerWidth();
    canvas2d.height = window.innerHeight();

    //
let objectList = {};

function crearObjeto3d(tipo, nombre){
  if(tipo == "cube"){
    crearCubo(nombre);
  }else if(tipo == "cone"){
    crearCono(nombre);
  }else if(tipo == "directionalLight"){
    crearLuzDireccional(nombre)
  }
}

function crearAsset3d(tipo, nombre, src){
  if(tipo == "Mesh"){
    crearMesh(nombre, src);
  }
}

function crearCubo(name){
  if (objectList[name]) {
    Swal.fire({
  title: "Error De Creación",
  text: `Ya existe un Objeto con El Nombre ${name}`,
  icon: "error",
  showConfirmButton: true
})
    return;
  }

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });

  const mesh = new THREE.Mesh(geometry, material);
  objectList[name] = mesh;
  
  scene.add(mesh);
}

function crearCono(name){
  if (objectList[name]) {
    Swal.fire({
  title: "Error De Creación",
  text: `Ya existe un Objeto con El Nombre ${name}`,
  icon: "error",
  showConfirmButton: true
})
    return;
  }

  const geometry = new THREE.ConeGeometry(5, 10, 22);
  const material = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });

  const mesh = new THREE.Mesh(geometry, material);
  objectList[name] = mesh;
  
  scene.add(mesh);
}

function crearLuzDireccional(name){
  const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
  objectList[name] = light;
  scene.add(light);
}

function crearMesh(name, src){
  GLTFloader.load(
    src, 
    function (gltf) {
        const obj = gltf.scene;
        obj.name = name; 
        
        scene.add(obj);
        
        objectList[name] = obj; 
    },
    undefined,
    
    function (error) {
        console.error("Fallo al cargar el modelo:", error);
    }
);
}

const canvas3d = document.getElementById('view3d');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 360 / 250, 0.1, 1000);
camera.position.z = 5;

const render = new THREE.WebGLRenderer({ canvas: canvas3d, antialias: true });
render.setSize(360, 250);

const controls = new THREE.OrbitControls(camera, canvas3d);

const grid = new THREE.GridHelper(100, 100);
scene.add(grid);

const axis = new THREE.AxesHelper(2, 2, 2);
axis.position.y += 0.002;
scene.add(axis);

const ambient_light = new THREE.AmbientLight( 0x404040 );
scene.add(ambient_light);

const GLTFloader = new THREE.GLTFLoader();

function animate(){
  requestAnimationFrame(animate);
  controls.update();
  render.render(scene, camera);
}
animate();

let pyodide;
let interruptBuffer;
let running = false;
const loader = document.getElementById('loader');
const ltxt = document.getElementById('ltxt');

setInterval(() => {
  clearInterval(this);
  
  if (pyodide) {
    loader.style.transition = "opacity 0.5s ease-out";
    loader.style.opacity = 0;
    
    setTimeout(() => loader.style.display = 'none', 500);
    return;
  }
}, 300);

async function initPython() {
  pyodide = await loadPyodide();
  
  interruptBuffer = new Int32Array(new SharedArrayBuffer(4));
  pyodide.setInterruptBuffer(interruptBuffer);
}

async function gameLoop() {
  if (!running) return;
  try {
    await pyodide.runPythonAsync("update()");
  } catch (e) {
    console.error(e);
    running = false;
  }
  requestAnimationFrame(gameLoop);
}

async function ejecutar() {
  if (!pyodide) {
    return Swal.fire({ title: 'Cargando...', text: 'Python aún se está cargando', icon: 'info' });
  }
  
  const codigo = code;
  
  try {

    axis.visible = false;
    grid.visible = false;

    Atomics.store(interruptBuffer, 0, 0);
    
    pyodide.globals.set("create3dPrimitive", (tipo, nombre) => crearObjeto3d(tipo, nombre));
    pyodide.globals.set("move3d", (nombre, x, y, z) => objectList[nombre].position.set(x, y, z));
    pyodide.globals.set("rotate3d", (nombre, x, y, z) => objectList[nombre].rotation.set(x, y, z));
    pyodide.globals.set("scale3d", (nombre, x, y, z) => objectList[nombre].scale.set(x, y, z));
    pyodide.globals.set("toast", (msg) => Swal.fire({ text: msg }));
    pyodide.globals.set("alert", (msg, msgt, iconn) => Swal.fire({ title: msg, text: msgt, icon: iconn }));
    pyodide.globals.set("cam3d_set_free", () => controls.enabled = true)
    pyodide.globals.set("cam3d_set_static", () => controls.enabled = false)
    pyodide.globals.set("cam3d_set", (x, y, z) => camera.position.set(x, y, z));
    pyodide.globals.set("cam3d_set_rotation", (x, y, z) => camera.rotation.set(x, y, z));
    pyodide.globals.set("cam3d_third_person", (obj) => camera.lookAt(objectList[obj].position));
    pyodide.globals.set("drawText", (txt, x, y) => ctx.fillText(txt, x, y));
    pyodide.globals.set("clear", () => ctx.clearRect(0, 0, canvas2d.width, canvas2d.height));
    pyodide.globals.set("drawRect", (x, y, w, h) => ctx.fillRect(x, y, w, h));
    pyodide.globals.set("setColor", (color) => ctx.fillStyle = color);
    pyodide.globals.set("drawCircle", (x, y, r) => drawCircle(x, y, r));
    pyodide.globals.set("setAmbientLight3dColor", (colour) => ambient_light.color = colour);
    pyodide.globals.set("setAmbientLight3dIntensity", (intensityy) => ambient_light.intensity = intensityy);
    pyodide.globals.set(
      "set3dLightIntensity", 
      (light, intensityy) =>
      objectList[light].intensity = intensityy);
    pyodide.globals.set(
      "set3dLightColor",
      (light, colour) =>
      objectList[light].color = colour);
    pyodide.globals.set("setFont", (font) => ctx.font = font);
    pyodide.globals.set("show3dAxes", () => axis.visible = true);
    pyodide.globals.set("hide3dAxes", () => axis.visible = false);
    pyodide.globals.set("createAudio", (name, src) => createAudio(name, src));
    pyodide.globals.set("playAudio", (name) => objectList[name].play);
    pyodide.globals.set("stopAudio", (name) => objectList[name].stop);
    pyodide.globals.set("pauseAudio", (name) => objectList[name].pause);
    pyodide.globals.set("save", (key, value) => localStorage.setItem(key, value));
    pyodide.globals.set("load", (key) => localStorage.getItem(key));
    pyodide.globals.set("unsave", (key) => localStorage.removeItem(key));
    pyodide.globals.set("createAsset3d", (name, src) => crearAsset(name, src));
    pyodide.globals.set("screen_touched", () => pantalla_tocada());
    pyodide.globals.set("key_down", (key) => tecla_tocada(key));
    
    await pyodide.runPythonAsync(codigo);
    
    running = true;
    requestAnimationFrame(gameLoop);
    
  } catch (error) {
    Swal.fire({ title: 'Error Python', text: error.message, icon: 'error' });
  }
}

async function detener() {
  axis.visible = true;
  grid.visible = true;

  for (let key in objectList) {
    delete objectList[key];
  }

  running = false;

  Atomics.store(interruptBuffer, 0, 2);

  ctx.clearRect(0, 0, canvas2d.width, canvas2d.height);
}

function createAudio(name, src){
    const audio = new Audio(src);
    objectList[name] = audio;
}

let pantallaTocada = false;
let teclaTocada = null;

function pantalla_tocada() {
    return pantallaTocada;
}

function tecla_tocada(key) {
    return teclaTocada === key;
}

document.addEventListener("touchstart", function () {
    pantallaTocada = true;
});

document.addEventListener("keydown", function (event) {
    teclaTocada = event.code;
});

document.addEventListener("keyup", function () {
    teclaTocada = null;
});

document.addEventListener("touchend", function () {
    pantallaTocada = false;
});

ejecutar();

  </script>
</body>
</html>
  `;
  
  const blob = new Blob([template], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = game_name.value + '.html';
  a.click();
  URL.revokeObjectURL(url);
}
