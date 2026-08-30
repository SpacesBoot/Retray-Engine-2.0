import { loadPyodide } from "pyodide";
import Swal from "sweetalert2";
import { crearObjeto3d, crearAsset3d, objectList, axis, grid, camera, controls, ambient_light, cam3d_third_person_fn, displaceTo_fn } from "../three/three";
import { pantalla_tocada, tecla_tocada } from "../input/input";
import { editor } from "../code_editor/editor/editor";
import { objectList3D } from "../3d/objects3d/objects3d";
import { objectList2D } from "../2d/objects2d/objects2d";

let pyodide: any = null;
let interruptBuffer: Int32Array | null = null;
let running: boolean = false;
let mode: string = "blocks";

const loader: HTMLElement | null = document.getElementById('loader');
const ltxt: HTMLInputElement | null = document.getElementById('ltxt');
const game_name: HTMLInputElement | null = document.getElementById("game_name");
const ot: HTMLInputElement | null = document.getElementById("ot");
const oc: HTMLInputElement | null = document.getElementById("optionalColor");

const datos_curiosos: string[] = ["Quiero mis Vacaciones Sr Pool...", "Prueben NewCatroid!"];
const indice: number = Math.floor(Math.random() * datos_curiosos.length);

const intervalId = setInterval(() => {
  if (pyodide) {
    if (ltxt) ltxt.value = "¡Listo!";
    if (loader) {
      loader.style.transition = "opacity 0.5s ease-out";
      loader.style.opacity = "0";
      setTimeout(() => loader!.style.display = 'none', 500);
    }
    clearInterval(intervalId);
  } else {
    if (ltxt) ltxt.value = datos_curiosos[indice];
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
    pyodide.globals.set("setAmbientLight3dColor", (colour: string) => ambient_light.color = colour);
    pyodide.globals.set("setAmbientLight3dIntensity", (intensityy: number) => ambient_light.intensity = intensityy);
    pyodide.globals.set("set3dLightIntensity", (light: string, intensityy: number) => objectList[light].intensity = intensityy);
    pyodide.globals.set("set3dLightColor", (light: string, colour: string) => objectList[light].color = colour);
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
  
  for (let key in objectList3D) {
    if (objectList3D[key]?.geometry) objectList3D[key].geometry.dispose();
    if (objectList3D[key]?.material) objectList3D[key].material.dispose();
    delete objectList3D[key];
  }
  for (let key in objectList2D) {
    if (objectList2D[key]?.geometry) objectList2D[key].geometry.dispose();
    if (objectList2D[key]?.material) objectList2D[key].material.dispose();
    delete objectList2D[key];
  }
}

window.addEventListener("load", async () => {
  await initPython();
    if (loader) loader.style.display = 'none';
});

export {loader, ltxt, game_name, ot, oc, ejecutar, detener, pyodide, running, mode, initPython, gameLoop};