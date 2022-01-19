import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Stats from 'stats.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'




/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Dat.gui

const gui = new dat.GUI({closed: true, width: 400})



/**
 * Update Materials
 */

const updateMaterials = () => {
scene.traverse((child) => {
    
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
        
        child.material.envMap = environmentMAp
        child.material.envMapIntensity = 0
        gsap.to(child.material,{duration: 4, delay: 1, envMapIntensity:0.15})

        // if (child.name != "base"){

        // //     child.castShadow = true 
        // //     child.receiveShadow = true

        // }
        child.material.needsUpdate = true
    }
})
}


/**
 * Textures Loading
 */

// const loadingManager = new THREE.LoadingManager()
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

// const textureLoader = new THREE.TextureLoader(loadingManager)

// const texture_color = textureLoader.load("/concrete/vjctbag_2K_Albedo.jpg")
// const texture_ao = textureLoader.load("/concrete/vjctbag_2K_AO.jpg")
// const texture_displacement = textureLoader.load("/concrete/vjctbag_2K_Displacement.jpg")
// const texture_normal = textureLoader.load("/concrete/vjctbag_2K_Normal.jpg")
// const texture_roughness = textureLoader.load("/concrete/vjctbag_2K_Roughness.jpg") 

/**
 *  Cube Texture Loader
 */

const cubeTextureLoader = new THREE.CubeTextureLoader()

// Environment Map

const environmentMAp = cubeTextureLoader.load([
    "/cube_map/px.png",
    "/cube_map/nx.png",
    "/cube_map/py.png",
    "/cube_map/ny.png",
    "/cube_map/pz.png",
    "/cube_map/nz.png"
])
environmentMAp.encoding = THREE.sRGBEncoding
// scene.background = environmentMAp
scene.environment = environmentMAp


/**
 * Sizes
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
 * ------------------------------------------------------------------ Models Loader
 */

const gltfLoader = new GLTFLoader()
gltfLoader.load(
    "/gltf/scene.gltf",
    (gltf) => {
        // scene.add(gltf.scene.children[0])
        // scene.add(gltf.scene)

        const children = [...gltf.scene.children]
    
        for( const child of children){
            scene.add(child)
        }

        updateMaterials()

    }
    // () => {
    //     console.log("success")
    // },
    // () => {
    //     console.log("progress")
    // },
    // () => {
    //     console.log("error")
    // }
)


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

//Debug



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

/**
 * ------------------------------------------------------------------ Geometry
 */
//new THREE.MeshBasicMaterial



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
 const point_light1 = new THREE.PointLight( 0xffffff, 0, 100 )
 gsap.to(point_light1,{duration: 4, delay: 1, intensity:3})

 point_light1.position.set(1.8, 2, 1.85)
 scene.add( point_light1 )

 //PointLight2
 const point_light2 = new THREE.PointLight( 0x00B8FF, 0, 100 )
 gsap.to(point_light2,{duration: 4, delay: 1, intensity:2})

 point_light2.position.set(2, 1.35, -2)
 scene.add( point_light2 )


//Ambiente Light
// const amb_light = new THREE.AmbientLight(0xffffff, 0.05)
// scene.add(amb_light)

//Sphere
// const sphere_geometry = new THREE.SphereGeometry( 0.1, 32, 16 );
// const sphere_material = new THREE.MeshBasicMaterial( { color: 0x00B8FF } );
// const sphere = new THREE.Mesh( sphere_geometry, sphere_material );
// sphere.position.set(point_light2.position.x,point_light2.position.y,point_light2.position.z)
// scene.add( sphere );

/**
 * ------------------------------------------------------------------ Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
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
