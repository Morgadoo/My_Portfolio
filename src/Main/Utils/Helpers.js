import * as THREE from 'three'

export default class Helpers{
    
    constructor(scene, floorDistance){

        const gridHelper = new THREE.GridHelper( 5, 8, 0x898989,0x898989 )
        gridHelper.position.set(0,-0.05,0)
        gridHelper.rotation.y = Math.PI/4
        gridHelper.materials

        const gridHelper2 = new THREE.GridHelper( 5, 8, 0x898989,0x898989 )
        gridHelper2.position.set(0,-0.05-floorDistance,0)
        gridHelper2.rotation.y = Math.PI/4

        const gridHelper3 = new THREE.GridHelper( 5, 8, 0x898989,0x898989 )
        gridHelper3.position.set(0,-0.05-floorDistance*2,0)
        gridHelper3.rotation.y = Math.PI/4

        scene.add( gridHelper, gridHelper2, gridHelper3 )
    }
}