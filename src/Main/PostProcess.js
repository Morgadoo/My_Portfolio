import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

export default class PostProcess{
    
    constructor(renderer){
        
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
        
    }

    disposeMaterial( obj ) {

        if ( obj.material ) {
    
            obj.material.dispose();
    
        }
    
    }
    
    render() {
    
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
    
    
    renderBloom( mask ) {
    
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
    
    darkenNonBloomed( obj ) {
    
        if ( bloomLayer.test( obj.layers ) === false ) {  //obj.isMesh && bloomLayer.test( obj.layers ) === false
    
            materials[ obj.uuid ] = obj.material;
            obj.material = darkMaterial;
    
        }
    
    }
    
    restoreMaterial( obj ) {
    
        if ( materials[ obj.uuid ] ) {
    
            obj.material = materials[ obj.uuid ];
            delete materials[ obj.uuid ];
    
        }
    }

}





