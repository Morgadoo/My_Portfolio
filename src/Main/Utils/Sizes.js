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
        
        // Update camera
        camera.aspect = this.width / this.height
        camera.updateProjectionMatrix()

        if (this.width < 800){
            camera.fov = 35
        }else {
            camera.fov = 25
        }

        // Update renderer
        renderer.setSize(this.width, this.height)
        renderer.setPixelRatio(this.pixelRatio)

        console.log("Update resize")
    }
}
