import * as dat from 'dat.gui'

export default class DatGui{
    
    constructor(){
        
        const gui = new dat.GUI({closed: false, width: 400})
        return gui
    }
}