import gsap from 'gsap'

export default class Scroll{
    
    constructor(){

        this.scrollY = window.scrollY
        this.currentSection = 0

    
    }
    updateScroll(height){
        this.scrollY = window.scrollY
        const newSection = Math.round(this.scrollY/height)
            if (newSection != this.currentSection){
                this.currentSection = newSection
    
                // if(newSection == 1){
                //     gsap.to(cube2.rotation,{duration: 2, delay: 0.5, ease: "power2.inOut", y: "+=3.14"})
                // }else if (newSection == 2){
                //     gsap.to(cube3.rotation,{duration: 2, delay: 0.5, ease: "power2.inOut", y: "+=3.14"})
    
                // }
            }
        console.log("Update scroll" , newSection)
    }
}