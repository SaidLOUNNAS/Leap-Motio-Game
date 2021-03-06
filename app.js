import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import particleImageSource from './assets/images/particles/1.png'
import { frame } from './leap.js'
import { getCoords } from './function.js';

export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

// Définit la taille du canvas à la taille de la fenêtre
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Pour les prochains changement de taille
window.onresize = () => {
    if (ctx instanceof CanvasRenderingContext2D) {
        ctx.save();
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.restore();
        console.info('Le canvas a été redimensionné');
    }
};
/**
 * GLTFLoader
 */


DRACOLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(DRACOLoader)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load(particleImageSource)


/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {}
sizes.width = window.innerWidth
sizes.height = window.innerHeight

window.addEventListener('resize', () => {
    // Save sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (_event) => {
    cursor.x = _event.clientX / sizes.width - 0.5
    cursor.y = _event.clientY / sizes.height - 0.5
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000)

scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0x000000, 1)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)

/**
 * Orbit controls
 */
// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true
// controls.zoomSpeed = 0.3

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.x = 5
directionalLight.position.y = 5
directionalLight.position.z = 5
scene.add(directionalLight)

/**
 * Model
 */

/**
 * Particles
 */
// Geometry
const particlesGeometry = new THREE.Geometry()

for (let i = 0; i < 1000; i++) {
    // Vertice
    const vertice = new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
    )
    particlesGeometry.vertices.push(vertice)


    // Color
    const color = new THREE.Color(
        Math.random(),
        Math.random(),
        Math.random()
    )
    particlesGeometry.colors.push(color)
}

// Material
const particlesMaterial = new THREE.PointsMaterial({
    vertexColors: true,
    size: 0.4,
    sizeAttenuation: true,
    // color: new THREE.Color(0xff0000),
    // map: particleTexture
    alphaMap: particleTexture,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)


// Load model
const shipgroup = new THREE.Group()
shipgroup.scale.set(0.01, 0.01, 0.01)
scene.add(shipgroup)

gltfLoader.load(
    'models/vaisseau3D.gltf',
    (gltf) => {
        console.log('success')
        console.log(gltf)

        while (gltf.scene.children.length) {
            shipgroup.add(gltf.scene.children[0])
        }
    },
    undefined,
    (error) => {
        console.log('error')
        console.log(error)
    }
)
// Keyboard

const keyboard = {}
keyboard.up = false
keyboard.down = false
keyboard.right = false
keyboard.left = false
document.addEventListener('keydown', (_event) => {
    console.log(_event.code)
    switch (_event.code) {
        case 'KeyW':
        case 'ArrowUp':
            keyboard.up = true
            break
        case 'KeyD':
        case 'ArrowRight':
            keyboard.right = true
            break
        case 'KeyS':
        case 'ArrowDown':
            keyboard.down = true
            break
        case 'KeyA':
        case 'ArrowLeft':
            keyboard.left = true
            break
    }
})
document.addEventListener('keyup', (_event) => {
    console.log(_event.code)
    switch (_event.code) {
        case 'KeyW':
        case 'ArrowUp':
            keyboard.up = false
            break
        case 'KeyD':
        case 'ArrowRight':
            keyboard.right = false
            break
        case 'KeyS':
        case 'ArrowDown':
            keyboard.down = false
            break
        case 'KeyA':
        case 'ArrowLeft':
            keyboard.left = false
            break
    }
})


/**
 * Loop
 */

const loop = () => {
    // console.log(frame)
    window.requestAnimationFrame(loop)

    frame.hands.forEach((hand) => {
        let fingerPos = getCoords(hand.indexFinger.tipPosition, frame, canvas);
        console.log(fingerPos);

        if (fingerPos.y<canvas.height/2&&fingerPos.x>canvas.width/3&&fingerPos.x<canvas.width*0.66) {
            shipgroup.position.y += 0.1
            shipgroup.rotation.x -= (0.5 + shipgroup.rotation.x) / 10
        }
        
        if (fingerPos.y>canvas.height/2&&fingerPos.x>canvas.width/3&&fingerPos.x<canvas.width*0.66) {
            shipgroup.position.y -= 0.1
            shipgroup.rotation.x += (0.5 - shipgroup.rotation.x) / 10}

        if (fingerPos.x>canvas.width*0.66) {
            shipgroup.position.x -= 0.1
            shipgroup.rotation.z += (0.5 - shipgroup.rotation.z) / 10
        }
        if (fingerPos.x<canvas.width/3) {
            shipgroup.position.x += 0.1
            shipgroup.rotation.z -= (0.5 + shipgroup.rotation.z) / 10
        } 

    });

    //Update star
    for (const _vertice of particlesGeometry.vertices) {
        _vertice.z -= 0.90
        if (_vertice.z < -30) {
            _vertice.z = +40 + (Math.random() * 10)
        }
    }
    particlesGeometry.verticesNeedUpdate = true

    // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)
    camera.position.x = shipgroup.position.x
    camera.position.z = shipgroup.position.z - 12
    camera.position.y = shipgroup.position.y + 4
    camera.rotation.y = Math.PI
}

loop()