import gsap from 'gsap'

export default class Controls{
    
    constructor(camera, width, height){

        this.cursor = {
                x:0,
                y:0
            }
            
        window.addEventListener("mousemove", (event) => {

            this.cursor.x = event.clientX / width - 0.5
            this.cursor.y = event.clientY / height - 0.5
        
            gsap.to(camera.position,{duration: 2, delay: 0.05, x:Math.cos(this.cursor.x * Math.PI/12)*9.5})
            gsap.to(camera.position,{duration: 2, delay: 0.05, z:Math.sin(this.cursor.x * Math.PI/12)*9.5})
            // gsap.to(camera.position,{duration: 2, delay: 0.05, y:-cursor.y * 2 + 2})
        
        })
    }
}