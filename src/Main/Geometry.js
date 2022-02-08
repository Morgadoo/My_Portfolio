import * as THREE from 'three'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { Wireframe } from 'three/examples/jsm/lines/Wireframe.js';
import { WireframeGeometry2 } from 'three/examples/jsm/lines/WireframeGeometry2.js';

export default class Geometry{
    
    constructor(scene){

        const floorDistance = 4
        const offsetDistance = 0.05


        // Wireframe ( WireframeGeometry2, LineMaterial )

        const geo = new THREE.IcosahedronBufferGeometry( 1.2, 1 )

        const geometry = new WireframeGeometry2( geo )

        const matLine = new LineMaterial( {

            color: 0x49bf9d,
            linewidth: 0.005, // in pixels
            //resolution:  // to be set by renderer, eventually
            dashSize: 0.1,
            dashScale: 2,
            gapSize: 0.1,
            dashed: false

        } );

        this.wireframe = new Wireframe( geometry, matLine )
        this.wireframe.computeLineDistances()
        this.wireframe.position.y = -floorDistance - offsetDistance + 1.2     //-floorDistance - offsetDistance + 0.5
        scene.add( this.wireframe )

        //wave

        const SEPARATION = 0.3, AMOUNTX = 50, AMOUNTY = 50
        const numParticles = AMOUNTX * AMOUNTY

        const positions = new Float32Array( numParticles * 3 )
		const scales = new Float32Array( numParticles )

        let i = 0, j = 0;

        for ( let ix = 0; ix < AMOUNTX; ix ++ ) {

            for ( let iy = 0; iy < AMOUNTY; iy ++ ) {

                positions[ i ] = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 ); // x
                positions[ i + 1 ] = -7; // y
                positions[ i + 2 ] = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 ); // z

                scales[ j ] = 1;

                i += 3;
                j ++;

            }

        }
        const geometryWave = new THREE.BufferGeometry()
        geometryWave.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) )
        geometryWave.setAttribute( 'scale', new THREE.BufferAttribute( scales, 1 ) )

        this.materialWave = new THREE.ShaderMaterial({
            transparent:true,
            uniforms: {
                color: { value: new THREE.Color().setHSL( 0.48,0.4,0.4 ) },
            },
            vertexShader:`
            attribute float scale;

			void main() {

				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

				gl_PointSize = scale * ( 300.0 / - mvPosition.z );

				gl_Position = projectionMatrix * mvPosition;

			}`,
            fragmentShader: `
            uniform vec3 color;
            
			void main() {

				if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;

				gl_FragColor = vec4( color, 1 );

			}`
        })

        this.particles = new THREE.Points( geometryWave, this.materialWave );
        this.particles.rotation.y = Math.PI/4
		scene.add( this.particles );



    }
}