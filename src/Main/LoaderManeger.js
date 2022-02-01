import * as THREE from 'three'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { Mesh } from 'three'

export default class LoaderManeger{
    
    constructor(scene, overlayMaterial, BLOOM_SCENE){
        
        const loadingBarElement = document.querySelector(".loading_bar")

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
    }
}