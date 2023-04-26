import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useRef } from "react";
import { ShaderMaterial, Vector2, WebGLRenderer } from "three";

// const { width, height } = renderer.getDrawingBufferSize(new Vector2());
// const { width, height } = getDrawingBufferSize(new Vector2());

// const renderer = new WebGLRenderer();
// const canvasSize = renderer.getSize(new Vector2());
// const width = canvasSize.width;
// const height = canvasSize.height;

const shader = new ShaderMaterial({
  vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * viewPosition;
        }`,
  fragmentShader: `
		//#define FAST_DESCENT

		//#define BLACK_AND_WHITE
		varying vec2 vUv;
		uniform vec3      iResolution;           // viewport resolution (in pixels)
		uniform float     iTime; 

		
		// Flaring by nimitz (twitter: @stormoid)
		// https://www.shadertoy.com/view/lsSGzy
		// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License
		// Contact the author for other licensing options

		//change this value (1 to 5) or tweak the settings yourself.
		//the gamma and spot brightness parameters can use negative values
		#define TYPE 2

		#if TYPE == 1
			#define brightness 1.
			#define ray_brightness 11.
			#define gamma 5.
			#define spot_brightness 4.
			#define ray_density 1.5
			#define curvature .1
			#define red   7.
			#define green 1.3
			#define blue  1.
			//1 -> ridged, 2 -> sinfbm, 3 -> pure fbm
			#define noisetype 2
			#define sin_freq 50. //for type 2
			#define warp true
		#elif TYPE == 2
			#define brightness 4.
			#define ray_brightness 5.5
			#define gamma 8.
			#define spot_brightness 15.
			#define ray_density 12.
			#define curvature 300.
			#define red   1.
			#define green 0.
			#define blue  0.
			#define noisetype 1
			#define sin_freq 5.
			// #define angle 0.5
			// #define freq 5.0
			#define warp true
		#endif


		//#define PROCEDURAL_NOISE
		//#define YO_DAWG
		// float hash( float n ){return fract(sin(n)*43758.5453);}
		// float noise( in vec2 x )
		// {
		// 	// #ifdef PROCEDURAL_NOISE
		// 	x *= 1.75;
		// 	vec2 p = floor(x);
		// 	vec2 f = fract(x);

		// 	f = f*f*(3.0-2.0*f);

		// 	float n = p.x + p.y*57.0;

		// 	float res = mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
		// 					mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
		// 	return res;
		// 	// #else
		// 	// return texture(iChannel0, x*.01).x;
		// 	// #endif
		// }
		// Gradient noise by iq - https://www.shadertoy.com/view/XdXGW8
		vec2 hash( vec2 x )  {
			const vec2 k = vec2( 0.3183099, 0.3678794 );
			x = x*k + k.yx;
			return -1.0 + 2.0*fract( 64.0 * k*fract( x.x*x.y*(x.x+x.y)) );
		}

		float noise( in vec2 p ){
			vec2 i = floor( p );
			vec2 f = fract( p );
			vec2 u = f*f*(3.0-2.0*f);
			return mix( mix( dot( hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
							dot( hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
						mix( dot( hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
							dot( hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
		}

		mat2 rot2d( float angle ) {
			float s = sin(angle);
			float c = cos(angle);
			return mat2(c, -s, s, c);
		}
		#define OCTAVES 6
		float fbm( in vec2 p, in float freq ){	
			float z = 1.;
			float rz = 0.;
			p *= 0.25;
			mat2 mrot =  rot2d(0.5);
			// mat2 mrot =  mat2(cos(0.5), -sin(0.5), sin(0.5), cos(0.5));
			for (int i= 1;i < OCTAVES;i++ ){
				rz += (sin(noise(p) * freq) * 0.5 + 0.5 ) / (z + iTime * 0.001);
				z *= 1.75; 
				p *= 2.;
				p *= mrot;
			}
			return rz;
		}

		// mat2 m2 = mat2( 0.80,  0.60, -0.60,  0.80 );
		// float fbm( in vec2 p )
		// {	
		// 	float z=2.;
		// 	float rz = 0.;
		// 	p *= 0.25;
		// 	for (float i= 1.;i < 6.;i++ )
		// 	{
		// 		#if noisetype == 1
		// 		rz+= abs((noise(p)-0.5)*2.)/z;
		// 		#elif noisetype == 2
		// 		rz+= (sin(noise(p)*sin_freq)*0.5+0.5) /z;
		// 		#else
		// 		rz+= noise(p)/z;
		// 		#endif
		// 		z = z*2.;
		// 		p = p*2.*m2;
		// 	}
		// 	return rz;
		// }

		void main(){
			//
			float t = iTime * 0.025;
			// thx Fabrice
			vec2 uv =  ( 2. * gl_FragCoord.xy - iResolution.xy ) / min(iResolution.x,iResolution.y);
			
			uv *= curvature * 5e-2;
			
			float r = sqrt( dot(uv, uv) );
			float x = dot( normalize(uv), vec2(.5, 0.) ) + t;	
			float y = dot (normalize(uv), vec2(.0, .5) ) + t;
			
			if (warp) {
			float d = ray_density * .5;
			x = fbm( vec2( y * d, r + x * d), sin_freq );
			y = fbm( vec2( r + y * d, x * d ), sin_freq );
			}

			float val = fbm( vec2(r + y * ray_density, r + x * ray_density - y), sin_freq);
			
			val = smoothstep( 0., ray_brightness, val);
			
			vec3 col = clamp( 1.- vec3(val), 0., 1.);
			
			col = mix(col, vec3(1.0), spot_brightness - 10.* r/curvature * 200./brightness);
			
			gl_FragColor = sqrt(vec4(col, 1.0));
		}

		// void main( out vec4 gl_FragColor, in vec2 gl_FragCoord )
		// void main()
		// {
		// 	float t = -iTime*0.03;
		// 	vec2 uv = gl_FragCoord.xy / iResolution.xy-0.5;
		// 	uv.x *= iResolution.x/iResolution.y;
		// 	uv*= curvature*.05+0.0001;
			
		// 	float r  = sqrt(dot(uv,uv));
		// 	float x = dot(normalize(uv), vec2(.5,0.))+t;	
		// 	float y = dot(normalize(uv), vec2(.0,.5))+t;
			
		// 	#ifdef YO_DAWG
		// 	x = fbm(vec2(y*ray_density*0.5,r+x*ray_density*.2));
		// 	y = fbm(vec2(r+y*ray_density*0.1,x*ray_density*.5));
		// 	#endif
			
		// 	float val;
		// 	val = fbm(vec2(r+y*ray_density,r+x*ray_density-y));
		// 	val = smoothstep(gamma*.02-.1,ray_brightness+(gamma*0.02-.1)+.001,val);
		// 	val = sqrt(val);
			
		// 	vec3 col = val/vec3(red,green,blue);
		// 	col = clamp(1.-col,0.,1.);
		// 	col = mix(col,vec3(1.),spot_brightness-r/0.1/curvature*200./brightness);
		// 	col = clamp(col,0.,1.);
		// 	col = pow(col,vec3(1.7));
			
		// 	gl_FragColor = vec4(col,1.0);
		// }
		
		
		`,
  uniforms: {
    iResolution: { value: new Vector2(0, 0) },
    iTime: { value: 0 },
  },
});

const ShaderPlane = () => {
  const { viewport, size } = useThree();
  console.log(size.width, size.height);
  console.log("viewport", viewport);

  useFrame(({ clock }) => {
    shader.uniforms.iTime.value = clock.getElapsedTime();
    shader.uniforms.iResolution.value.set(
      viewport.width * 100,
      viewport.height
    );
    // shader.uniforms.iResolution.value.set(size.width, size.height);
  });
  return (
    <mesh material={shader}>
      <planeGeometry args={[20, 20]} />
      {/* <shaderMaterial /> */}
    </mesh>
  );
};

const BlackHole = () => {
  return (
    <div className=' h-screen '>
      {/* <div>blackHole</div> */}
      <Canvas>
        {/* <OrbitControls /> */}
        <ShaderPlane />
      </Canvas>
    </div>
  );
};

export default BlackHole;
