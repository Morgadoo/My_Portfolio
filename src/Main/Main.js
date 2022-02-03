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

        //Dat.gui
        // this.datgui = new DatGui()
        // const datgui = new dat.GUI({closed: false, width: 400})


        // Loader Maneger
        this.loaderManeger = new LoaderManeger(scene, overlay.overlayMaterial)

        //Sizes
        this.sizes = new Sizes()
        window.addEventListener('resize', () => {
            this.sizes.updateSize(camera, renderer)
        })

        window.addEventListener("dblclick", () => {
            if (!document.fullscreenElement){
                site.requestFullscreen()
            }else{
                document.exitFullscreen()
            }
        })

        //Camera
        const camera = new Camera(this.sizes.width,this.sizes.height,scene)

        //Controls
        this.controls = new Controls(camera, this.sizes.width, this.sizes.height)

        //Scroll
        this.scroll = new Scroll(this.sizes.height)
        window.addEventListener("scroll", () => {
            this.scroll.updateScroll(this.sizes.height)
        })

        //Geometry
        // this.geometry = new Geometry(scene)

        //Helpers
        // this.helpers = new Helpers(scene, params.floorDistance)

        //Light
        // this.light = new Light(scene)
        
        //Renderer
        const renderer = new Renderer(canvas,this.sizes.width,this.sizes.height, this.sizes.pixelRatio)    

        //Animate
        this.animate = new Animate(scene, camera, renderer, params.floorDistance)

        //Stats
        const stats = new Stats()



    }
}