import * as THREE from 'three'
export default class Camera{

    constructor(width, height, scene){

        let camfov = 25
        if (width < 800){
            camfov = 35
        }else {
            camfov = 25
        }


        this.camera = new THREE.PerspectiveCamera(camfov , width / height, 0.1, 100)
        this.camera.rotation.y = Math.PI/2
        this.camera.position.set(9.91, 2.48, 0)
        this.camera.lookAt(0,1,0)
        scene.add(this.camera)
        return this.camera
    }
}