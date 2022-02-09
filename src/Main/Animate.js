import * as THREE from 'three'

export default class Animate{
    
    constructor(scene, camera, renderer, floorDistance, wireframe, particles, materialWave){

        const clock = new THREE.Clock()
        let lastElapsedTime = 0
        const scrollSpeed = 5

        const SEPARATION = 0.3, AMOUNTX = 50, AMOUNTY = 50


        const tick = () =>
        {
            const elapsedTime = clock.getElapsedTime()
            const deltaTime = elapsedTime - lastElapsedTime
            lastElapsedTime = elapsedTime

            //Animate camera
            const scrollScale = window.scrollY/window.innerHeight
            let valuey = ((2.48 - (scrollScale*floorDistance)) - camera.position.y) * deltaTime * scrollSpeed

            if (valuey >= 10){
                console.log(valuey)
                window.location.reload()
            } 
            camera.position.y += valuey
            camera.lookAt(0,1-(scrollScale*floorDistance),0)


            //Animate Particles
            const h = ( 360 * (0.5 + lastElapsedTime*0.03 ) % 360 ) / 360;

            materialWave.uniforms.color = {value: new THREE.Color().setHSL( h,0.4,0.4 )}

            const positions = particles.geometry.attributes.position.array;
			const scales = particles.geometry.attributes.scale.array;

            let i = 0, j = 0;

            for ( let ix = 0; ix < AMOUNTX; ix ++ ) {

                for ( let iy = 0; iy < AMOUNTY; iy ++ ) {

                    positions[ i + 1 ] = ( Math.sin( ( ix + lastElapsedTime*3 ) * 0.3 ) * 0.2 ) +
                                    ( Math.sin( ( iy + lastElapsedTime*3 ) * 0.5 ) * 0.2 ) - 8;

                    scales[ j ] = ( Math.sin( ( ix + lastElapsedTime*3 ) * 0.3 ) + 1 ) * 0.2 +
                                    ( Math.sin( ( iy + lastElapsedTime*3 ) * 0.5 ) + 1 ) * 0.2;

                    i += 3;
                    j ++;

                }

            }

            particles.geometry.attributes.position.needsUpdate = true;
            particles.geometry.attributes.scale.needsUpdate = true;


            // Render
            renderer.render(scene, camera)

            // Call tick again on the next frame
            window.requestAnimationFrame(tick)
        }

        tick()

    }
}