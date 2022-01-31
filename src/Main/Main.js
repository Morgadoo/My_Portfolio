import * as THREE from 'three'

import Animate from './Animate'
import Camera from './Camera'
import Controls from './Controls'
import Geometry from './Geometry'
import Light from './Light'
import LoaderManeger from './LoaderManeger'
import PostProcess from './PostProcess'
import Renderer from './Renderer'
import Scroll from './Scroll'
import DatGui from './Utils/DatGui'
import Helpers from './Utils/Helpers'
import Sizes from "./Utils/Sizes"
import Stats from './Utils/Stats'


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

        //Layers


        //Parameters
        const params = {
            exposure: 1,
            bloomStrength: 0.6,
            bloomThreshold: 0,
            bloomRadius: 0.3,
            scene: 'Scene with Glow',
            floorDistance : 4
        }

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

        //Dat.gui

        this.datgui = new DatGui()

        // Loader Maneger

        this.loaderManeger = new LoaderManeger(scene, overlayMaterial)

        //Sizes
        this.sizes = new Sizes()
        window.addEventListener('resize', () =>{
            this.sizes.updateSize(this.camera,this.renderer)
            // render()
        })

        window.addEventListener("dblclick", () => {
            if (!document.fullscreenElement){
                site.requestFullscreen()
            }else{
                document.exitFullscreen()
            }
        })

        //Camera
        this.camera = new Camera(this.sizes.width,this.sizes.height,scene)

        //Controls
        this.controls = new Controls(this.camera, this.sizes.width, this.sizes.height)

        //Scroll
        this.scroll = new Scroll(this.sizes.height)
        window.addEventListener("scroll", () => {
            this.scroll.updateScroll(this.sizes.height)
        })

        //Geometry
        // this.geometry = new Geometry(scene)

        //Helpers
        this.helpers = new Helpers(scene, params.floorDistance)

        //Light
        // this.light = new Light(scene)
        
        //Renderer
        this.renderer = new Renderer(canvas,this.sizes.width,this.sizes.height, this.sizes.pixelRatio)

        //Post Process
        // this.postprocess = new PostProcess(this.renderer)

        //Animate
        this.animate = new Animate(scene, this.camera, this.renderer, params.floorDistance)

        //Stats
        const stats = new Stats()
    }
}