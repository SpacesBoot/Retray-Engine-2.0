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

function cam3d_third_person_fn(obj, offsett) {
  const target = objectList[obj];
  if (target instanceof THREE.Object3D) {
    const offset = new THREE.Vector3(0, 5, offsett);
    const camPos = target.position.clone().add(offset);

    camera.position.copy(camPos);
    camera.lookAt(target.position);
  }
}

function displaceTo_fn(obj1, obj2, smoothness) {
  objectList[obj1].position.x += (objectList[obj2].position.x - objectList[obj1].position.x) * smoothness;
  objectList[obj1].position.y += (objectList[obj2].position.y - objectList[obj1].position.y) * smoothness;
  objectList[obj1].position.z += (objectList[obj2].position.z - objectList[obj1].position.z) * smoothness;
}

function animate(){
  requestAnimationFrame(animate);
  controls.update();
  render.render(scene, camera);
}
animate();