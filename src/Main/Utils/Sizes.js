export default class Sizes{

    constructor(){
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)
        this.aspectRatio = this.width / this.height

    }
    updateSize(camera, renderer){

        // Update sizes
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)
        
        if (this.width < 736){
            camera.fov = 35
            plane2Mesh.position.z = -0.3
            iconsMesh.position.z = -0.3
        }else {
            camera.fov = 25
            plane2Mesh.position.z =  0.5
            iconsMesh.position.z = 0.5
        }

        // Update camera
        camera.aspect = this.width / this.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(this.width, this.height)
        renderer.setPixelRatio(this.pixelRatio)

        // console.log("Update resize", this.width)
    }
}
