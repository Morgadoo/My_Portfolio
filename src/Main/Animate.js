import * as THREE from 'three'

export default class Animate{
    
    constructor(scene, camera, renderer, floorDistance){

        const clock = new THREE.Clock()
        let lastElapsedTime = 0
        const scrollSpeed = 5

        const tick = () =>
        {
            const elapsedTime = clock.getElapsedTime()
            const deltaTime = elapsedTime - lastElapsedTime
            lastElapsedTime = elapsedTime

            //Animate camera
            const scrollScale = window.scrollY/window.innerHeight
            let valuey = ((2.48 - (scrollScale*floorDistance)) - camera.position.y) * deltaTime * scrollSpeed

            if (valuey >= 1){
                console.log(valuey)
                valuey = -1         // window.location.reload()
            } 
            camera.position.y += valuey
            camera.lookAt(0,1-(scrollScale*floorDistance),0)

            // Render
            renderer.render(scene, camera)

            // Call tick again on the next frame
            window.requestAnimationFrame(tick)
        }

        tick()

    }
}