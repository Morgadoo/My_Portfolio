import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import Stats from 'stats.js'
// import * as dat from 'dat.gui'
import gsap from 'gsap'




/**
 * ------------------------------------------------------------------ Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

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



// const texture_bake1_mask = textureLoader.load("gltf/bake1_mask.jpg")
// texture_bake1_mask.minFilter = THREE.LinearFilter

const texture_bake2 = textureLoader.load("gltf/bake2.jpg")
texture_bake2.flipY = false
texture_bake2.encoding = THREE.sRGBEncoding
texture_bake2.minFilter = THREE.LinearFilter



const texture_bake3 = textureLoader.load("gltf/bake3.jpg")
texture_bake3.flipY = false
texture_bake3.encoding = THREE.sRGBEncoding
texture_bake3.minFilter = THREE.LinearFilter


// const texture_color = textureLoader.load("/concrete/vjctbag_2K_Albedo.jpg")
// const texture_ao = textureLoader.load("/concrete/vjctbag_2K_AO.jpg")
// const texture_displacement = textureLoader.load("/concrete/vjctbag_2K_Displacement.jpg")
// const texture_normal = textureLoader.load("/concrete/vjctbag_2K_Normal.jpg")
// const texture_roughness = textureLoader.load("/concrete/vjctbag_2K_Roughness.jpg") 


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

const  bake1Material = new THREE.MeshBasicMaterial({ map: texture_bake1, side: THREE.FrontSide})
const  bake1BackSideMaterial = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.BackSide})
const  bake2Material = new THREE.MeshBasicMaterial({map: texture_bake2})
const  bake3Material = new THREE.MeshBasicMaterial({map: texture_bake3})

const lightBlueMaterial = new THREE.MeshBasicMaterial({color: 0x00B8FF})
const lightWhiteMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF})


// OBJ Loader

// const objLoader = new OBJLoader(loadingManager)

// objLoader.load("obj/scene.obj",
//     (obj) => {
//         console.log(obj)
        
//         const lightBlueMesh = obj.children.find(child => child.name == "light_blue")
//         const lightWhiteMesh = obj.children.find(child => child.name == "light_white")
//         const planeMesh = obj.children.find(child => child.name == "Plane")
//         const objectsMesh = obj.children.find(child => child.name == "objects")
//         const lightsMesh = obj.children.find(child => child.name == "lights")

//         lightBlueMesh.material = lightBlueMaterial
//         lightWhiteMesh.material = lightWhiteMaterial
//         planeMesh.material = bake1Material
//         objectsMesh.material = bake2Material
//         lightsMesh.material = bake3Material

        
//         scene.add(obj)

//     })




// GLTF Loader

const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load(
    "/gltf/scene.glb",
    (gltf) => {

        const lightBlueMesh = gltf.scene.children.find(child => child.name == "light_blue")
        const lightWhiteMesh = gltf.scene.children.find(child => child.name == "light_white")
        const planeMesh = gltf.scene.children.find(child => child.name == "plane")
        const planeBackSideMesh = gltf.scene.children.find(child => child.name == "plane_back")
        const objectsMesh = gltf.scene.children.find(child => child.name == "objects")
        const lightsMesh = gltf.scene.children.find(child => child.name == "lights")

        lightBlueMesh.material = lightBlueMaterial
        lightWhiteMesh.material = lightWhiteMaterial
        planeMesh.material = bake1Material
        planeBackSideMesh.material = bake1BackSideMaterial
        objectsMesh.material = bake2Material
        lightsMesh.material = bake3Material

        
        // objectsMesh.geometry.drawRange(1,10)
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


    gsap.to(camera.position,{duration: 2, delay: 0.05, x:Math.cos(cursor.x * Math.PI/16)*9.5})
    gsap.to(camera.position,{duration: 2, delay: 0.05, z:Math.sin(cursor.x * Math.PI/16)*9.5})
    gsap.to(camera.position,{duration: 2, delay: 0.05, y:-cursor.y * 2 + 2})

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
    
    if (sizes.width < 800){
        camera.fov = 40
    }else {
        camera.fov = 25
    }
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener("dblclick", () => {
    if (!document.fullscreenElement){
        canvas.requestFullscreen()
    }else{
        document.exitFullscreen()
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




/**
 * Helpers
 */

//Axes Helper
// const axesHelper = new THREE.AxesHelper( 1 );
// axesHelper.position.set(0, 0, 0)0
// scene.add( axesHelper )


/**
 * ------------------------------------------------------------------  Light
 */

//PointLight1
//  const point_light1 = new THREE.PointLight( 0xffffff, 0, 100 )
//  gsap.to(point_light1,{duration: 4, delay: 1, intensity:3})

//  point_light1.position.set(1.8, 2, 1.85)
//  scene.add( point_light1 )

 //PointLight2
//  const point_light2 = new THREE.PointLight( 0x00B8FF, 0, 100 )
//  gsap.to(point_light2,{duration: 4, delay: 1, intensity:2})

//  point_light2.position.set(2, 1.35, -2)
//  scene.add( point_light2 )

//Rect Light 1 
// const rectAreaLight1 = new THREE.RectAreaLight(0x00B8FF , 0, 0.7, 0.7)
// gsap.to(rectAreaLight1,{duration: 4, delay: 1, intensity:30})
// rectAreaLight1.position.set(2, 1.40, -2)
// rectAreaLight1.lookAt(0,1.2,0)
// scene.add(rectAreaLight1)

// // Rect Light 2 
// const rectAreaLight2 = new THREE.RectAreaLight(0xffffff , 0, 0.5, 0.5)
// gsap.to(rectAreaLight2,{duration: 4, delay: 1, intensity:50})
// rectAreaLight2.position.set(1.85, 1.95, 1.9)
// rectAreaLight2.lookAt(0,1,0)
// scene.add(rectAreaLight2)

//Light Helper

// const lightHelper = new RectAreaLightHelper(rectAreaLight2)
// scene.add(lightHelper)


//Ambiente Light
// const amb_light = new THREE.AmbientLight(0xffffff, 0.05)
// scene.add(amb_light)




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
// renderer.physicallyCorrectLights = true
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1

// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap


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

    camera.lookAt(0,1,0)


    // Render
    renderer.render(scene, camera)

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
