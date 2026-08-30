import { loadPyodide } from "pyodide";
import Swal from "sweetalert2";
import { crearObjeto3d, crearAsset3d, objectList, axis, grid, camera, controls, ambient_light, cam3d_third_person_fn, displaceTo_fn } from "../three/three";
import { pantalla_tocada, tecla_tocada } from "../input/input";
import { ctx, canvas2d, drawCircle } from "../canvas/canvas";
import { createAudio } from "../audio/audio";
import { editor } from "../editor/editor";
import { game_name, ot, optionalColor } from "../save/save";

let pyodide: Awaited<ReturnType<typeof loadPyodide>> | null = null;
let interruptBuffer: Int32Array | null = null;
let running: boolean = false;

const loader: HTMLElement | null = document.getElementById('loader');
const ltxt: HTMLElement | null = document.getElementById('ltxt');
const game_name: HTMLElement | null = document.getElementById("game_name");
const ot: HTMLElement | null = document.getElementById("ot");
const oc: HTMLElement | null = document.getElementById("optionalColor");

const datos_curiosos: string[] = ["Quiero mis Vacaciones Sr Pool...", "Prueben NewCatroid!"];
const indice: number = Math.floor(Math.random() * datos_curiosos.length);

const intervalId = setInterval(() => {
  if (pyodide) {
    if (ltxt) ltxt.innerHTML = "¡Listo!";
    if (loader) {
      loader.style.transition = "opacity 0.5s ease-out";
      loader.style.opacity = "0";
      setTimeout(() => loader!.style.display = 'none', 500);
    }
    clearInterval(intervalId);
  } else {
    if (ltxt) ltxt.innerText = datos_curiosos[indice];
  }
}, 300);

async function initPython(): Promise<void> {
  pyodide = await loadPyodide();
  interruptBuffer = new Int32Array(new SharedArrayBuffer(4));
  pyodide.setInterruptBuffer(interruptBuffer);
}

async function gameLoop(): Promise<void> {
  if (!running || !pyodide) return;
  try {
    await pyodide.runPythonAsync("update()");
  } catch (e) {
    console.error(e);
    running = false;
  }
  requestAnimationFrame(gameLoop);
}

async function ejecutar(): Promise<void> {
  const codigo: string = editor.getValue();
  try {
    axis.visible = false;
    grid.visible = false;
    Atomics.store(interruptBuffer!, 0, 0);
    pyodide.globals.set("create3dPrimitive", (tipo: string, nombre: string) => crearObjeto3d(tipo, nombre));
    pyodide.globals.set("move3d", (nombre: string, x: number, y: number, z: number) => objectList[nombre].position.set(x, y, z));
    pyodide.globals.set("rotate3d", (nombre: string, x: number, y: number, z: number) => objectList[nombre].rotation.set(x, y, z));
    pyodide.globals.set("scale3d", (nombre: string, x: number, y: number, z: number) => objectList[nombre].scale.set(x, y, z));
    pyodide.globals.set("toast", (msg: string) => Swal.fire({ text: msg }));
    pyodide.globals.set("alert", (msg: string, msgt: string, iconn: string) => Swal.fire({ title: msg, text: msgt, icon: iconn }));
    pyodide.globals.set("cam3d_set_free", () => controls.enabled = true);
    pyodide.globals.set("cam3d_set_static", () => controls.enabled = false);
    pyodide.globals.set("cam3d_set", (x: number, y: number, z: number) => camera.position.set(x, y, z));
    pyodide.globals.set("cam3d_set_rotation", (x: number, y: number, z: number) => camera.rotation.set(x, y, z));
    pyodide.globals.set("cam3d_third_person", (obj: string, offset: number) => cam3d_third_person_fn(obj, offset));
    pyodide.globals.set("displaceTo3d", (obj1: string, obj2: string, smoothness: number) => displaceTo_fn(obj1, obj2, smoothness));
    pyodide.globals.set("drawText", (txt: string, x: number, y: number) => ctx.fillText(txt, x, y));
    pyodide.globals.set("clear", () => ctx.clearRect(0, 0, canvas2d.width, canvas2d.height));
    pyodide.globals.set("drawRect", (x: number, y: number, w: number, h: number) => ctx.fillRect(x, y, w, h));
    pyodide.globals.set("setColor", (color: string) => ctx.fillStyle = color);
    pyodide.globals.set("drawCircle", (x: number, y: number, r: number) => drawCircle(x, y, r));
    pyodide.globals.set("setAmbientLight3dColor", (colour: string) => ambient_light.color = colour);
    pyodide.globals.set("setAmbientLight3dIntensity", (intensityy: number) => ambient_light.intensity = intensityy);
    pyodide.globals.set("set3dLightIntensity", (light: string, intensityy: number) => objectList[light].intensity = intensityy);
    pyodide.globals.set("set3dLightColor", (light: string, colour: string) => objectList[light].color = colour);
    pyodide.globals.set("setFont", (font: string) => ctx.font = font);
    pyodide.globals.set("show3dAxes", () => axis.visible = true);
    pyodide.globals.set("hide3dAxes", () => axis.visible = false);
    pyodide.globals.set("createAudio", (name: string, src: string) => createAudio(name, src));
    pyodide.globals.set("playAudio", (name: string) => objectList[name].play());
    pyodide.globals.set("stopAudio", (name: string) => objectList[name].stop());
    pyodide.globals.set("pauseAudio", (name: string) => objectList[name].pause());
    pyodide.globals.set("save", (key: string, value: string) => localStorage.setItem(key, value));
    pyodide.globals.set("load", (key: string) => localStorage.getItem(key));
    pyodide.globals.set("unsave", (key: string) => localStorage.removeItem(key));
    pyodide.globals.set("createAsset3d", (tipo: string, name: string, src: string) => crearAsset3d(tipo, name, src));
    pyodide.globals.set("screen_touched", () => pantalla_tocada());
    pyodide.globals.set("key_down", (key: string) => tecla_tocada(key));
    await pyodide.runPythonAsync(codigo);
    running = true;
    requestAnimationFrame(gameLoop);
  } catch (error: any) {
    Swal.fire({ title: 'Error Python', text: error.message, icon: 'error' });
  }
}

async function detener(): Promise<void> {
  running = false;
  Atomics.store(interruptBuffer!, 0, 2);
  await new Promise(r => requestAnimationFrame(r));
  axis.visible = true;
  grid.visible = true;
  ctx.clearRect(0, 0, canvas2d.width, canvas2d.height);
  for (let key in objectList) {
    if (objectList[key]?.geometry) objectList[key].geometry.dispose();
    if (objectList[key]?.material) objectList[key].material.dispose();
    delete objectList[key];
  }
}

window.addEventListener("load", async () => {
  await initPython();
});
