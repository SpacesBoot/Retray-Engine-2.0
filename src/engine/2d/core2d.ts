import * as PIXI from 'pixi';
import * as Matter from 'matter-js';

const game = new PIXI.Application({
    view: document.getElementById('view-2d') as HTMLCanvasElement,
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
});

const physicsEngine = Matter.Engine.create();
const world = physicsEngine.world;
world.gravity.y = 1;

export { game, physicsEngine, world };