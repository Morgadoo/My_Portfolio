import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import {BloomPass} from 'three/examples/jsm/postprocessing/BloomPass.js'
import Stats from 'stats.js'
// import * as dat from 'dat.gui'
import gsap from 'gsap'
import { Mesh } from 'three'




/**
 * ------------------------------------------------------------------ Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')
const site = document.querySelector('html.mysite')

// Scene
const scene = new THREE.Scene()



// Overlay
 const overlayGeometry = new THREE.PlaneBufferGeometry(2,2,1,1)
 const overlayMaterial = new THREE.ShaderMaterial({
     transparent:true,
     uniforms:{
         uAlpha:{ value: 1}
     },
     vertexShader:`
     void main(){
         gl_Position = vec4(position, 1.0);
     }`,
     fragmentShader: `
     uniform float uAlpha;
     void main(){
         gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
     }`
 })
 const overlay = new THREE.Mesh(overlayGeometry,overlayMaterial)
 scene.add(overlay)


// Dat.gui

// const gui = new dat.GUI({closed: true, width: 400})



/**
 * Update Materials
 */

const updateMaterials = () => {
scene.traverse((child) => {
    
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
        
        child.material.envMap = environmentMAp
        child.material.envMapIntensity = 0
        gsap.to(child.material,{duration: 4, delay: 1, envMapIntensity:0.1})

        // if (child.name != "base"){

        // //     child.castShadow = true 
        // //     child.receiveShadow = true

        // }
        child.material.needsUpdate = true
    }
})
}

/**
 *  ------------------------------------------------------------------ Loader Maneger
 */

const loadingBarElement = document.querySelector(".loading_bar")

// loadingManager.onStart = () =>{
//     console.log("onStart")
// }
// loadingManager.onLoad = () =>{
//     console.log("onLoad")
// }
// loadingManager.onProgress = () =>{
//     console.log("onProgress")
// }
// loadingManager.onError = () =>{
//     console.log("onError")
// }    

const loadingManager = new THREE.LoadingManager(
    () => {

        gsap.delayedCall(1, () => {
            gsap.to(overlayMaterial.uniforms.uAlpha, {duration: 1, value:0})
            loadingBarElement.style.transform = ""
            loadingBarElement.classList.add("ended")

        })
 
    },
    (itemUrl, itemsLoaded, itemsTotal) => {
        const progressRatio = itemsLoaded / itemsTotal
        loadingBarElement.style.transform = `scaleX(${progressRatio})`
        console.log(itemsLoaded,itemsTotal,progressRatio)
    },
    () => {
        console.log("error")
    }
)

/**
 * Textures Loading
 */

const textureLoader = new THREE.TextureLoader(loadingManager)

const texture_bake1 = textureLoader.load("gltf/bake1.jpg")
texture_bake1.flipY = false
texture_bake1.encoding = THREE.sRGBEncoding
texture_bake1.minFilter = THREE.LinearFilter

const texture_bake1_1 = textureLoader.load("gltf/bake1_1.jpg")
texture_bake1_1.flipY = false
texture_bake1_1.encoding = THREE.sRGBEncoding
texture_bake1_1.minFilter = THREE.LinearFilter



const texture_bake1_mask = textureLoader.load("gltf/bake1_mask.jpg")
texture_bake1_mask.minFilter = THREE.LinearFilter

const texture_bake2 = textureLoader.load("gltf/bake2.jpg")
texture_bake2.flipY = false
texture_bake2.encoding = THREE.sRGBEncoding
texture_bake2.minFilter = THREE.LinearFilter



const texture_bake3 = textureLoader.load("gltf/bake3.jpg")
texture_bake3.flipY = false
texture_bake3.encoding = THREE.sRGBEncoding
texture_bake3.minFilter = THREE.LinearFilter


/**
 *  Cube Texture Loader
 */

// const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)

// Environment Map

// const environmentMAp = cubeTextureLoader.load([
//     "/cube_map/px.png",
//     "/cube_map/nx.png",
//     "/cube_map/py.png",
//     "/cube_map/ny.png",
//     "/cube_map/pz.png",
//     "/cube_map/nz.png"
// ])
// environmentMAp.encoding = THREE.sRGBEncoding
// scene.background = environmentMAp
// scene.background = new THREE.Color( 0x111111 )
// scene.environment = environmentMAp


/**
 * Models Loader
 */

// Draco Loader

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')


// GLTF Materials

const  bake1Material = new THREE.MeshBasicMaterial({ map: texture_bake1, alphaMap:texture_bake1_mask, side: THREE.FrontSide, transparent: true})
const  bake1_1Material = new THREE.MeshBasicMaterial({ map: texture_bake1_1, alphaMap:texture_bake1_mask, side: THREE.FrontSide, transparent: true})
const  bake1BackSideMaterial = new THREE.MeshBasicMaterial({color: 0x000000, alphaMap:texture_bake1_mask, side: THREE.BackSide, transparent: true})
const  bake2Material = new THREE.MeshBasicMaterial({map: texture_bake2})
const  bake3Material = new THREE.MeshBasicMaterial({map: texture_bake3})

const lightBlueMaterial = new THREE.MeshBasicMaterial({color: 0x00B8FF})
const lightWhiteMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF})

//Varabel

const floorDistance = 4
const offsetDistance = 0.05


// GLTF Loader

const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load(
    "/gltf/scene_simple.glb",
    (gltf) => {

        //Scene 1
        const lightBlueMesh = gltf.scene.children.find(child => child.name == "light_blue")
        const lightWhiteMesh = gltf.scene.children.find(child => child.name == "light_white")
        const planeMesh = gltf.scene.children.find(child => child.name == "plane")
        const planeBackSideMesh = planeMesh.clone()
        const objectsMesh = gltf.scene.children.find(child => child.name == "objects")
        const lightsMesh = gltf.scene.children.find(child => child.name == "lights")

        lightBlueMesh.material = lightBlueMaterial
        lightWhiteMesh.material = lightWhiteMaterial
        planeMesh.material = bake1Material
        planeBackSideMesh.material = bake1BackSideMaterial

        objectsMesh.material = bake2Material
        lightsMesh.material = bake3Material

        planeMesh.position.y =+ -0.0001
        planeBackSideMesh.position.y =+ -0.0001
        scene.add(planeBackSideMesh)

        //Scene 2
        const plane2Mesh = planeMesh.clone()
        const plane2BackSideMesh = planeMesh.clone()
        const cube2Mesh = new THREE.BoxBufferGeometry(1,1,1)

        plane2Mesh.material = bake1_1Material
        plane2BackSideMesh.material = bake1BackSideMaterial

        window.cube2 = new Mesh(cube2Mesh,lightBlueMaterial)

        plane2Mesh.position.y =+ -floorDistance
        plane2BackSideMesh.position.y =+ -floorDistance
        cube2.position.y = -floorDistance - offsetDistance + 0.5


        scene.add(plane2Mesh,plane2BackSideMesh,cube2)

        //Scene 3
        const plane3Mesh = planeMesh.clone()
        const plane3BackSideMesh = planeMesh.clone()

        plane3Mesh.material = bake1_1Material
        plane3BackSideMesh.material = bake1BackSideMaterial

        window.cube3 = new Mesh(cube2Mesh,lightBlueMaterial)

        plane3Mesh.position.y =+ -floorDistance *  2
        plane3BackSideMesh.position.y =+ -floorDistance * 2
        cube3.position.y = -(floorDistance * 2) - offsetDistance + 0.5

        
        scene.add(plane3Mesh,plane3BackSideMesh,cube3)

        console.log(gltf.scene.children)
        scene.add(gltf.scene)
    }
)

/**
 * ------------------------------------------------------------------ Sizes
 */
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * ------------------------------------------------------------------ Cursor
 */
const cursor = {
    x:0,
    y:0
}
window.addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5


    gsap.to(camera.position,{duration: 2, delay: 0.05, x:Math.cos(cursor.x * Math.PI/12)*9.5})
    gsap.to(camera.position,{duration: 2, delay: 0.05, z:Math.sin(cursor.x * Math.PI/12)*9.5})
    // gsap.to(camera.position,{duration: 2, delay: 0.05, y:-cursor.y * 2 + 2})

})

/**
 * ------------------------------------------------------------------ Camera
 */

// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.rotation.y = Math.PI/2
camera.position.set(9.91, 2.48, 0)
camera.lookAt(0,1,0)
scene.add(camera)


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    //Update effect composer
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    effectComposer.setSize(sizes.width, sizes.height)


})

window.addEventListener("dblclick", () => {
    if (!document.fullscreenElement){
        site.requestFullscreen()
    }else{
        document.exitFullscreen()
    }
})

/**
 * ------------------------------------------------------------------ Scroll
 */

let scrollY = window.scrollY
let currentSection = 0

window.addEventListener("scroll", () => {
    scrollY = window.scrollY
    const newSection = Math.round(scrollY/sizes.height)
    
    if (newSection != currentSection){
        currentSection = newSection
        console.log(newSection)

        if(newSection == 1){
            gsap.to(cube2.rotation,{duration: 2, delay: 0.5, ease: "power2.inOut", y: "+=3.14"})
        }else if (newSection == 2){
            gsap.to(cube3.rotation,{duration: 2, delay: 0.5, ease: "power2.inOut", y: "+=3.14"})

        }
    }
})


// ------------------------------------------------------------------ Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true
// controls.zoomSpeed = 0.25
// controls.target = new THREE.Vector3( 0, 1, 0 )

// controls.autoRotate = true
// controls.autoRotateSpeed = -0.1

/**
 * ------------------------------------------------------------------ Geometry
 */
//Particles

// const particlesCount = 200

// const particlePositions = new Float32Array(particlesCount * 3)

// for (let i = 0; i < particlesCount; i++){

//     particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 5
//     particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 0.01 -0.1
//     particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 5

// }

// const particlesGeo = new THREE.BufferGeometry()
// particlesGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions,3))

// const particlesMat = new THREE.PointsMaterial({
//     color: 0xc0c0c0,
//     sizeAttenuation:true,
//     size: 0.03
// })

// const particles = new THREE.Points(particlesGeo,particlesMat)

// scene.add(particles)


/**
 * ------------------------------------------------------------------ Helpers
 */

//Axes Helper
// const axesHelper = new THREE.AxesHelper( 1 );
// axesHelper.position.set(0, 0, 0)0
// scene.add( axesHelper )

const gridHelper = new THREE.GridHelper( 5, 8, 0x898989,0x898989 )
gridHelper.position.set(0,-0.05,0)
gridHelper.rotation.y = Math.PI/4

const gridHelper2 = new THREE.GridHelper( 5, 8, 0x898989,0x898989 )
gridHelper2.position.set(0,-0.05-floorDistance,0)
gridHelper2.rotation.y = Math.PI/4

const gridHelper3 = new THREE.GridHelper( 5, 8, 0x898989,0x898989 )
gridHelper3.position.set(0,-0.05-floorDistance*2,0)
gridHelper3.rotation.y = Math.PI/4

scene.add( gridHelper, gridHelper2, gridHelper3 )

/**
 * ------------------------------------------------------------------  Light
 */



/**
 * ------------------------------------------------------------------ Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1


/**
 * ------------------------------------------------------------------ Post Processing
 */
const renderTarget = new THREE.WebGLMultisampleRenderTarget(
    800,
    600,
    {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        encoding: THREE.sRGBEncoding
    }

)


const effectComposer = new EffectComposer(renderer, renderTarget)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width, sizes.height)

const renderPass = new RenderPass(scene,camera)
effectComposer.addPass(renderPass)

const bloomPass = new UnrealBloomPass()
bloomPass.threshold = 0.29  //0.25
bloomPass.strength = 0.15    //0.15
bloomPass.radius = 0.3
// bloomPass.enabled = false

effectComposer.addPass(bloomPass)

/**
 * ------------------------------------------------------------------ Animate
 */

const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    // Update controls
    // controls.update()

    //Animate camera
    const scrollScale = scrollY/sizes.height
    // camera.position.y =  2.48 - (scrollScale*floorDistance)
    camera.position.y += ((2.48 - (scrollScale*floorDistance)) - camera.position.y)*0.1
    camera.lookAt(0,1-(scrollScale*floorDistance),0)


    // Render
    // renderer.render(scene, camera)
    effectComposer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


//Stats - npm install stats.js
var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

function animate() {

	stats.begin()

	// monitored code goes here

	stats.end()

	requestAnimationFrame( animate )

}
requestAnimationFrame( animate )
