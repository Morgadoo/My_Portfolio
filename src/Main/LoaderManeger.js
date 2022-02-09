import * as THREE from 'three'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { Mesh } from 'three'

export default class LoaderManeger{
    
    constructor(scene, overlayMaterial){
        
        const loadingBarElement = document.querySelector(".loading_bar")

        const loadingManager = new THREE.LoadingManager(
            () => {

                gsap.delayedCall(1, () => {
                    gsap.to(overlayMaterial.uniforms.uAlpha, {duration: 1, value:0})
                    loadingBarElement.style.transform = ""
                    loadingBarElement.classList.add("ended")
                    gsap.delayedCall(1, () => {
                        overlayMaterial.uniforms.Flip = -1
                    })
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

        const texture_floor1 = textureLoader.load("gltf/objects_floor.jpg")
        texture_floor1.flipY = false
        texture_floor1.encoding = THREE.sRGBEncoding
        texture_floor1.minFilter = THREE.LinearFilter

        const texture_floor2 = textureLoader.load("gltf/icons_floor.jpg")
        texture_floor2.flipY = false
        texture_floor2.encoding = THREE.sRGBEncoding
        texture_floor2.minFilter = THREE.LinearFilter

        const texture_mask = textureLoader.load("gltf/mask.jpg")
        texture_mask.minFilter = THREE.LinearFilter

        const texture_objects = textureLoader.load("gltf/objects.jpg")
        texture_objects.flipY = false
        texture_objects.encoding = THREE.sRGBEncoding
        texture_objects.minFilter = THREE.LinearFilter

        const texture_icons = textureLoader.load("gltf/icons.jpg")
        texture_icons.flipY = false
        texture_icons.encoding = THREE.sRGBEncoding
        texture_icons.minFilter = THREE.LinearFilter

        const texture_lights = textureLoader.load("gltf/lights.jpg")
        texture_lights.flipY = false
        texture_lights.encoding = THREE.sRGBEncoding
        texture_lights.minFilter = THREE.LinearFilter


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

        const  floor1Material = new THREE.MeshBasicMaterial({ map: texture_floor1, alphaMap:texture_mask, side: THREE.FrontSide, transparent: true})
        const  floor2Material = new THREE.MeshBasicMaterial({ map: texture_floor2, alphaMap:texture_mask, side: THREE.FrontSide, transparent: true})
        const  backfloorMaterial = new THREE.MeshBasicMaterial({color: 0x000000, alphaMap:texture_mask, side: THREE.BackSide, transparent: true})
        const  objectsMaterial = new THREE.MeshBasicMaterial({map: texture_objects})
        const  iconsMaterial = new THREE.MeshBasicMaterial({map: texture_icons})
        const  lightsMaterial = new THREE.MeshBasicMaterial({map: texture_lights})


        const lightBlueMaterial = new THREE.MeshBasicMaterial({color: 0x00B8FF})
        const lightWhiteMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF})

        //Varabel

        const floorDistance = 4
        const offsetDistance = 0.05


        // GLTF Loader

        const gltfLoader = new GLTFLoader(loadingManager)
        gltfLoader.setDRACOLoader(dracoLoader)

        gltfLoader.load(
            "/gltf/scene.glb",
            (gltf) => {

                //Floor 1
                const lightBlueMesh = gltf.scene.children.find(child => child.name == "light_blue")
                const lightWhiteMesh = gltf.scene.children.find(child => child.name == "light_white")
                const planeMesh = gltf.scene.children.find(child => child.name == "plane")
                window.iconsMesh = gltf.scene.children.find(child => child.name == "icons")
                const objectsMesh = gltf.scene.children.find(child => child.name == "objects")
                const lightsMesh = gltf.scene.children.find(child => child.name == "lights")

                const planeBackSideMesh = planeMesh.clone()
                

                lightBlueMesh.material = lightBlueMaterial
                lightWhiteMesh.material = lightWhiteMaterial

                planeMesh.material = floor1Material
                planeBackSideMesh.material = backfloorMaterial

                objectsMesh.material = objectsMaterial
                lightsMesh.material = lightsMaterial

                scene.add(planeBackSideMesh)

                //Floor 2
                window.plane2Mesh = planeMesh.clone()
                const plane2BackSideMesh = planeMesh.clone()

                plane2Mesh.material = floor2Material
                plane2BackSideMesh.material = backfloorMaterial

                iconsMesh.material = iconsMaterial

                plane2Mesh.position.y =+ -floorDistance
                plane2BackSideMesh.position.y =+ -floorDistance-offsetDistance
                iconsMesh.position.y =+ -floorDistance

                if (window.innerWidth < 736){
                    plane2Mesh.position.z = -0.3
                    iconsMesh.position.z = -0.3
                }else {
                    plane2Mesh.position.z = 0.5
                    iconsMesh.position.z = 0.5
                }
            
                scene.add(plane2Mesh, plane2BackSideMesh, iconsMesh)

                console.log(gltf.scene.children)
                scene.add(gltf.scene)
            }
        )
    }
}