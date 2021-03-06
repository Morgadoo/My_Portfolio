import * as THREE from 'three'

import Animate from './Animate'
import Camera from './Camera'
import Controls from './Controls'
import Geometry from './Geometry'
import Light from './Light'
import LoaderManeger from './LoaderManeger'
import Renderer from './Renderer'
import Scroll from './Scroll'
import Helpers from './Utils/Helpers'
import Sizes from "./Utils/Sizes"
import Stats from './Utils/Stats'
import Overlay from './Overlay.js'


export default class Main{
    constructor(){
        console.log("Start Main")
        
        /**
         * Main
         */
        
        // Canvas 
        const canvas = document.querySelector('canvas.webgl')

        //HTML
        const site = document.querySelector('html.mysite')

        // Scene
        const scene = new THREE.Scene()
                
        //Parameters
        const params = {
        floorDistance : 4
        }

        // Overlay
        const overlay = new Overlay(scene, params.floorDistance)

        //Layers

    
        // Loader Maneger
        const loaderManeger = new LoaderManeger(scene, overlay.overlayMaterial)

       
        //Sizes
        const sizes = new Sizes()
        window.addEventListener('resize', () => {
            sizes.updateSize(camera, renderer.renderer)
        })

        window.addEventListener("dblclick", () => {
            if (!document.fullscreenElement){
                site.requestFullscreen()
            }else{
                document.exitFullscreen()
            }
        })


        //Camera
        const camera = new Camera(sizes.width, sizes.height, scene)

        //Controls
        const controls = new Controls(camera, sizes.width, sizes.height)

        //Scroll
        const scroll = new Scroll(sizes.height)
        window.addEventListener("scroll", () => {
            scroll.updateScroll(sizes.height)
        })

        //Geometry
        const geometry = new Geometry(scene)

        //Helpers
        // this.helpers = new Helpers(scene, params.floorDistance)

        //Light
        // this.light = new Light(scene)
        
        //Renderer
        const renderer = new Renderer(canvas, sizes.width, sizes.height, sizes.pixelRatio)    

        //Animate
        const animate = new Animate(scene, camera, renderer.renderer, params.floorDistance, geometry.wireframe, geometry.particles, geometry.materialWave)

        //Stats
        // const stats = new Stats()



    }
}