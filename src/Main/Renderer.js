import * as THREE from 'three'

export default class Renderer{
    
    constructor(canvas, width, height, pixelRatio){

        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        })
        this.renderer.setSize(width, height)
        this.renderer.setPixelRatio(pixelRatio)
        this.renderer.outputColorSpace = THREE.SRGBColorSpace
        this.renderer.toneMapping = THREE.ReinhardToneMapping
        this.renderer.toneMappingExposure = 1

    }
}