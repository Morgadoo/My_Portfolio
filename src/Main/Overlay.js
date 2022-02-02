import * as THREE from 'three'

export default class Overlay{
    
    constructor(scene, floorDistance){

        this.overlayGeometry = new THREE.PlaneBufferGeometry(2,20,1,1)
        this.overlayMaterial = new THREE.ShaderMaterial({
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
        this.overlay = new THREE.Mesh(this.overlayGeometry, this.overlayMaterial)
        this.overlay.position.y = 2.48 - ((window.scrollY/window.innerHeight)*floorDistance)
        scene.add(this.overlay)
    }
}