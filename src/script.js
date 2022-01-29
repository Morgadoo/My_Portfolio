import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
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

scene.traverse( disposeMaterial );
scene.children.length = 0;

// ------------------------------------------------------------------------------------------------------------------------------------
const ENTIRE_SCENE = 0
const BLOOM_SCENE = 1

//Layers

const bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_SCENE );


const params = {
    exposure: 1,
    bloomStrength: 0.6,
    bloomThreshold: 0,
    bloomRadius: 0.3,
    scene: 'Scene with Glow'
};

const darkMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );
const materials = {};

//------------------------------------------------------------------------------------------------------------------------------------
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

// const gui = new dat.GUI({closed: false, width: 400})



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

        window.cube2 = new Mesh(cube2Mesh,lightWhiteMaterial)

        plane2Mesh.position.y =+ -floorDistance
        plane2BackSideMesh.position.y =+ -floorDistance
        cube2.position.y = -floorDistance - offsetDistance + 0.5
        cube2.layers.enable( BLOOM_SCENE );


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
        cube3.layers.enable( BLOOM_SCENE );

        
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
let camfov = 25
if (sizes.width < 800){
    camfov = 35
}else {
    camfov = 25
}

const camera = new THREE.PerspectiveCamera(camfov , sizes.width / sizes.height, 0.1, 100)
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

    if (sizes.width < 800){
        camera.fov = 35
    }else {
        camera.fov = 25
    }

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    //Update effect composer
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    effectComposer.setSize(sizes.width, sizes.height)

    //Update FinalComposer
    finalComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    finalComposer.setSize(sizes.width, sizes.height)

    render();
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
gridHelper.materials

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
let renderTargetClass = null

if(renderer.capabilities.isWebGL2){
    renderTargetClass = THREE.WebGLMultisampleRenderTarget
}else{
    renderTargetClass = THREE.WebGLRenderTarget
}


const renderTarget = new renderTargetClass( //WebGLRenderTarget
    sizes.width,
    sizes.height,
    {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        encoding: THREE.sRGBEncoding
    }

)
const renderPass = new RenderPass(scene,camera)

const bloomPass = new UnrealBloomPass()
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

const effectComposer = new EffectComposer(renderer) // renderTarget
effectComposer.renderToScreen = false
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width, sizes.height)
effectComposer.addPass(renderPass)
effectComposer.addPass(bloomPass)

const finalPass = new ShaderPass(
    new THREE.ShaderMaterial( {
        uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: effectComposer.renderTarget2.texture }
        },
        vertexShader:`
        varying vec2 vUv;

			void main() {

				vUv = uv;

				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			}`,
        fragmentShader: `
        uniform sampler2D baseTexture;
		uniform sampler2D bloomTexture;

			varying vec2 vUv;

			void main() {

				gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

			}`
    } ), 'baseTexture'
);

finalPass.needsSwap = true;

const finalComposer = new EffectComposer( renderer , renderTarget );
finalComposer.addPass( renderPass );
finalComposer.addPass( finalPass );

render();


//-------------
// const raycaster = new THREE.Raycaster();

// const mouse = new THREE.Vector2();

// window.addEventListener( 'pointerdown', onPointerDown );

// function onPointerDown( event ) {

//     mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//     mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
//     raycaster.setFromCamera( mouse, camera );
//     const intersects = raycaster.intersectObjects( scene.children, false );
//     if ( intersects.length > 0 ) {
//         const object = intersects[ 0 ].object;
//         console.log(object)
//         // object.layers.toggle( BLOOM_SCENE );
//         render();

//     }

// }

//----------

// gui.add( params, 'scene', [ 'Scene with Glow', 'Glow only', 'Scene only' ] ).onChange( function ( value ) {

//     switch ( value ) 	{

//         case 'Scene with Glow':
//             effectComposer.renderToScreen = false;
//             break;
//         case 'Glow only':
//             effectComposer.renderToScreen = true;
//             break;
//         case 'Scene only':
//             // nothing to do
//             break;

//     }

//     render();

// } );


function disposeMaterial( obj ) {

    if ( obj.material ) {

        obj.material.dispose();

    }

}

function render() {

    switch ( params.scene ) {

        case 'Scene only':
            renderer.render( scene, camera );
            break;
        case 'Glow only':
            renderBloom( false );
            break;
        case 'Scene with Glow':
        default:
            // render scene with bloom
            renderBloom( true );

            // render the entire scene, then render bloom scene on top
            finalComposer.render();
            break;

    }

}


function renderBloom( mask ) {

    if ( mask === true ) {

        scene.traverse( darkenNonBloomed );
        effectComposer.render();
        scene.traverse( restoreMaterial );

    } else {

        camera.layers.set( BLOOM_SCENE );
        effectComposer.render();
        camera.layers.set( ENTIRE_SCENE );

    }

}

function darkenNonBloomed( obj ) {

    if ( bloomLayer.test( obj.layers ) === false ) {  //obj.isMesh && bloomLayer.test( obj.layers ) === false

        materials[ obj.uuid ] = obj.material;
        obj.material = darkMaterial;

    }

}

function restoreMaterial( obj ) {

    if ( materials[ obj.uuid ] ) {

        obj.material = materials[ obj.uuid ];
        delete materials[ obj.uuid ];

    }

}



/**
 * ------------------------------------------------------------------ Animate
 */

const clock = new THREE.Clock()
let lastElapsedTime = 0
// let looky = 1
const scrollSpeed = 5

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    // Update controls
    // controls.update()

    //Animate camera
    const scrollScale = scrollY/sizes.height
    let valuey = ((2.48 - (scrollScale*floorDistance)) - camera.position.y)*deltaTime * scrollSpeed
    // looky += ((1-(scrollScale*floorDistance)) - (camera.position.y-1.48))* deltaTime * scrollSpeed

    if (valuey > 1){
        console.log(valuey)
        valuey = 0
    } 
    camera.position.y += valuey
    camera.lookAt(0,1-(scrollScale*floorDistance),0)

    // Render
    // renderer.render(scene, camera)
    render()

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
