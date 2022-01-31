import * as THREE from 'three'

export default class Overlay{
    
    constructor(scene){

        this.overlayGeometry = new THREE.PlaneBufferGeometry(2,2,1,1)
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
        scene.add(this.overlay)
    }
}