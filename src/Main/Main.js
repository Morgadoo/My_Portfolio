import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
// import * as dat from 'dat.gui'


import Animate from './Animate'
import Camera from './Camera'
import Controls from './Controls'
import Geometry from './Geometry'
import Light from './Light'
import LoaderManeger from './LoaderManeger'
import Renderer from './Renderer'
import Scroll from './Scroll'
import DatGui from './Utils/DatGui'
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
        scene.traverse( disposeMaterial );
        scene.children.length = 0;

        //Layers
        const ENTIRE_SCENE = 0
        const BLOOM_SCENE = 1

        const bloomLayer = new THREE.Layers()
        bloomLayer.set( BLOOM_SCENE )

        const darkMaterial = new THREE.MeshBasicMaterial( { color: 'black' } )
        const materials = {}

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
        const overlay = new Overlay(scene)

        //Dat.gui
        // this.datgui = new DatGui()
        // const datgui = new dat.GUI({closed: false, width: 400})


        // Loader Maneger
        this.loaderManeger = new LoaderManeger(scene, overlay.overlayMaterial, BLOOM_SCENE)

        //Sizes
        this.sizes = new Sizes()
        window.addEventListener('resize', () => {
            this.sizes.updateSize(camera, renderer, effectComposer, finalComposer) // effectComposer, finalComposer
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
        this.helpers = new Helpers(scene, params.floorDistance)

        //Light
        // this.light = new Light(scene)
        
        //Renderer
        const renderer = new Renderer(canvas,this.sizes.width,this.sizes.height, this.sizes.pixelRatio)

        //Post Process

        let renderTargetClass = null

        if(renderer.capabilities.isWebGL2){
            renderTargetClass = THREE.WebGLMultisampleRenderTarget
        }else{
            renderTargetClass = THREE.WebGLRenderTarget
        }


        const renderTarget = new renderTargetClass( //WebGLRenderTarget
            this.sizes.width,
            this.sizes.height,
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

        const effectComposer = new EffectComposer(renderer) 
        effectComposer.renderToScreen = false
        effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        effectComposer.setSize(this.sizes.width, this.sizes.height)
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



        // datgui.add( params, 'scene', [ 'Scene with Glow', 'Glow only', 'Scene only' ] ).onChange( function ( value ) {

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




        //Animate
        this.animate = new Animate(scene, camera, this.renderer, params.floorDistance, render )

        //Stats
        const stats = new Stats()



    }
}