import Stat from 'stats.js'



export default class Stats{

    constructor(){

        //Stats - npm install stats.js
        var stats = new Stat();
        stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( stats.dom );

        function animate() {

            stats.begin()

            // monitored code goes here

            stats.end()

            requestAnimationFrame( animate )

        }
        requestAnimationFrame( animate )
    }
}