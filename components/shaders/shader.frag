#extension GL_OES_standard_derivatives : enable
#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float uTime;
uniform sampler2D tDiffuse;
uniform sampler2D u_audioFreq;
varying vec2 vUv;
uniform vec3 colorA;
uniform vec3 colorB;
uniform float topOffset;
uniform bool metal;
uniform bool isMobile;

// Value Noise 2D
// Return value range of 0.0->1.0
// Source: https://github.com/BrianSharpe/Wombat
// Derived from: https://github.com/BrianSharpe/GPU-Noise-Lib
float Value2D( vec2 P )
{
	//	establish our grid cell and unit position
	vec2 Pi = floor(P);
	vec2 Pf = P - Pi;

	//	calculate the hash.
	vec4 Pt = vec4( Pi.xy, Pi.xy + 1.0 );
	Pt = Pt - floor(Pt * ( 1.0 / 71.0 )) * 71.0;
	Pt += vec2( 26.0, 161.0 ).xyxy;
	Pt *= Pt;
	Pt = Pt.xzxz * Pt.yyww;
	vec4 hash = fract( Pt * ( 1.0 / 951.135664 ) );

	//	blend the results and return
	vec2 blend = Pf * Pf * Pf * (Pf * (Pf * 6.0 - 15.0) + 10.0);
	vec4 blend2 = vec4( blend, vec2( 1.0 - blend ) );
	return dot( hash, blend2.zxzx * blend2.wwyy );
}

// Value Noise 3D
// Return value range of 0.0->1.0
// Source: https://github.com/BrianSharpe/Wombat
// Derived from: https://github.com/BrianSharpe/GPU-Noise-Lib
float Value3D( vec3 P )
{
	// establish our grid cell and unit position
	vec3 Pi = floor(P);
	vec3 Pf = P - Pi;
	vec3 Pf_min1 = Pf - 1.0;

	// clamp the domain
	Pi.xyz = Pi.xyz - floor(Pi.xyz * ( 1.0 / 69.0 )) * 69.0;
	vec3 Pi_inc1 = step( Pi, vec3( 69.0 - 1.5 ) ) * ( Pi + 1.0 );

	// calculate the hash
	vec4 Pt = vec4( Pi.xy, Pi_inc1.xy ) + vec2( 50.0, 161.0 ).xyxy;
	Pt *= Pt;
	Pt = Pt.xzxz * Pt.yyww;
	vec2 hash_mod = vec2( 1.0 / ( 635.298681 + vec2( Pi.z, Pi_inc1.z ) * 48.500388 ) );
	vec4 hash_lowz = fract( Pt * hash_mod.xxxx );
	vec4 hash_highz = fract( Pt * hash_mod.yyyy );

	//	blend the results and return
	vec3 blend = Pf * Pf * Pf * (Pf * (Pf * 6.0 - 15.0) + 10.0);
	vec4 res0 = mix( hash_lowz, hash_highz, blend.z );
	vec4 blend2 = vec4( blend.xy, vec2( 1.0 - blend.xy ) );
	return dot( res0, blend2.zxzx * blend2.wwyy );
}

// Perlin Noise 2D
// Return value range of -1.0->1.0
// Source: https://github.com/BrianSharpe/Wombat
// Derived from: https://github.com/BrianSharpe/GPU-Noise-Lib
float Perlin2D( vec2 P )
{
	// establish our grid cell and unit position
	vec2 Pi = floor(P);
	vec4 Pf_Pfmin1 = P.xyxy - vec4( Pi, Pi + 1.0 );

	// calculate the hash
	vec4 Pt = vec4( Pi.xy, Pi.xy + 1.0 );
	Pt = Pt - floor(Pt * ( 1.0 / 71.0 )) * 71.0;
	Pt += vec2( 26.0, 161.0 ).xyxy;
	Pt *= Pt;
	Pt = Pt.xzxz * Pt.yyww;
	vec4 hash_x = fract( Pt * ( 1.0 / 951.135664 ) );
	vec4 hash_y = fract( Pt * ( 1.0 / 642.949883 ) );

	// calculate the gradient results
	vec4 grad_x = hash_x - 0.49999;
	vec4 grad_y = hash_y - 0.49999;
	vec4 grad_results = inversesqrt( grad_x * grad_x + grad_y * grad_y ) * ( grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww );

	// classic Perlin Interpolation
	grad_results *= 1.4142135623730950488016887242097; // scale things to a strict -1.0->1.0 range *= 1.0/sqrt(0.5)
	vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
	vec4 blend2 = vec4( blend, vec2( 1.0 - blend ) );
	return dot( grad_results, blend2.zxzx * blend2.wwyy );
}

// Perlin Noise 3D
// Return value range of -1.0->1.0
// Source: https://github.com/BrianSharpe/Wombat
// Derived from: https://github.com/BrianSharpe/GPU-Noise-Lib
float Perlin3D( vec3 P )
{
	// establish our grid cell and unit position
	vec3 Pi = floor(P);
	vec3 Pf = P - Pi;
	vec3 Pf_min1 = Pf - 1.0;

	// clamp the domain
	Pi.xyz = Pi.xyz - floor(Pi.xyz * ( 1.0 / 69.0 )) * 69.0;
	vec3 Pi_inc1 = step( Pi, vec3( 69.0 - 1.5 ) ) * ( Pi + 1.0 );

	// calculate the hash
	vec4 Pt = vec4( Pi.xy, Pi_inc1.xy ) + vec2( 50.0, 161.0 ).xyxy;
	Pt *= Pt;
	Pt = Pt.xzxz * Pt.yyww;
	const vec3 SOMELARGEFLOATS = vec3( 635.298681, 682.357502, 668.926525 );
	const vec3 ZINC = vec3( 48.500388, 65.294118, 63.934599 );
	vec3 lowz_mod = vec3( 1.0 / ( SOMELARGEFLOATS + Pi.zzz * ZINC ) );
	vec3 highz_mod = vec3( 1.0 / ( SOMELARGEFLOATS + Pi_inc1.zzz * ZINC ) );
	vec4 hashx0 = fract( Pt * lowz_mod.xxxx );
	vec4 hashx1 = fract( Pt * highz_mod.xxxx );
	vec4 hashy0 = fract( Pt * lowz_mod.yyyy );
	vec4 hashy1 = fract( Pt * highz_mod.yyyy );
	vec4 hashz0 = fract( Pt * lowz_mod.zzzz );
	vec4 hashz1 = fract( Pt * highz_mod.zzzz );

	// calculate the gradients
	vec4 grad_x0 = hashx0 - 0.49999;
	vec4 grad_y0 = hashy0 - 0.49999;
	vec4 grad_z0 = hashz0 - 0.49999;
	vec4 grad_x1 = hashx1 - 0.49999;
	vec4 grad_y1 = hashy1 - 0.49999;
	vec4 grad_z1 = hashz1 - 0.49999;
	vec4 grad_results_0 = inversesqrt( grad_x0 * grad_x0 + grad_y0 * grad_y0 + grad_z0 * grad_z0 ) * ( vec2( Pf.x, Pf_min1.x ).xyxy * grad_x0 + vec2( Pf.y, Pf_min1.y ).xxyy * grad_y0 + Pf.zzzz * grad_z0 );
	vec4 grad_results_1 = inversesqrt( grad_x1 * grad_x1 + grad_y1 * grad_y1 + grad_z1 * grad_z1 ) * ( vec2( Pf.x, Pf_min1.x ).xyxy * grad_x1 + vec2( Pf.y, Pf_min1.y ).xxyy * grad_y1 + Pf_min1.zzzz * grad_z1 );

	// classic Perlin Interpolation
	vec3 blend = Pf * Pf * Pf * (Pf * (Pf * 6.0 - 15.0) + 10.0);
	vec4 res0 = mix( grad_results_0, grad_results_1, blend.z );
	vec4 blend2 = vec4( blend.xy, vec2( 1.0 - blend.xy ) );
	float final = dot( res0, blend2.zxzx * blend2.wwyy );
	return ( final * 1.1547005383792515290182975610039 ); // scale things to a strict -1.0->1.0 range *= 1.0/sqrt(0.75)
}

vec4 mainImage( sampler2D u_audioFreq, vec2 fragCoord ){
	float dimension = 1. - topOffset;
	dimension = dimension / .5;
	float intTopOffset = topOffset;
    float BuconeroDimension = 12.;

// // Spatial coordinates
	vec2 uv = fragCoord-u_resolution.xy*0.5;
// // Normalized pixel coordinates (from 0 to 1)
	vec2 uvn = fragCoord/u_resolution.xx;
    float ar = u_resolution.y/u_resolution.x;
	if(intTopOffset > .5){
		intTopOffset = intTopOffset * (1. + (.08* (1.-dimension)));
	}
    float pocciaDimension = 1.7 * (1. - (.3 * (1. - dimension)));
	if(isMobile){
		pocciaDimension = pocciaDimension / 3.;
	}

// Find usable frequencies in the audio file
	// vec3 test = texture(u_audioFreq, uvn).xyz;
	// test.g = 1.0-smoothstep(0.0, 0.005, abs(uvn.x-0.096));
	// test.g *= 0.5;
	// fragColor = vec4(test,1.0);
// Sample specific notes from the audio file


	float amp = texture2D(u_audioFreq, vec2(0.096, 0.1)).x;
	amp += texture2D(u_audioFreq, vec2(0.121, 0.3)).x;
	amp += texture2D(u_audioFreq, vec2(0.329, 0.2)).x * 2.;

	// float amp = texture2D(u_audioFreq,vUv).x;

// Procedural grain

	float grain = .0;
	if(!metal){
		grain = Value3D(vec3(uv*0.407*(1.0-0.05)+7.03, 1.4));
		grain += Value3D(vec3(uv*0.573*(1.0-0.1)+17.47, 3.5));
		grain += Value3D(vec3(uv*0.619*(1.0-0.15)+23.51, 5.6));
		grain *= 0.025;
		grain += 0.9;
	}


	float sinTime = abs(sin(uTime));
    float mouseDeltaX = .05 - ((u_resolution.x/2. - u_mouse.x) / (u_resolution.x/2.)) * .05;
	vec2 gradVecOffset = vec2(0.45 + mouseDeltaX , (intTopOffset + .01 * sinTime) * ar);
	float gradLength = length(uvn - gradVecOffset);
	float grad = clamp(gradLength*pocciaDimension-amp*0.005, 0.0, 1.0);
	float mouseGrad = clamp(length((u_mouse.xy / u_resolution.xx ) - vec2(0.5, 0.5*ar))*pocciaDimension-amp*0.0125, 0.0, 1.0);

    
    float mouseDelta = 1.5 - (abs(u_resolution.x/2. - u_mouse.x) / (u_resolution.x/2.)) * .5;
    float blurDelta = .1 + (abs(u_resolution.x/2. - u_mouse.x) / (u_resolution.x/2.)) * .9;
	
	float shape = smoothstep(0.1, blurDelta * 15., ((mouseDelta*grad-0.125*dimension)/fwidth(grad)));
	
    float highlight = smoothstep(0.0, 0.2, grad-amp*0.05+Perlin3D(vec3(uvn*6.7+2.3, uTime*0.75+11.1))*0.1*(amp*0.5+0.75));
        
    grad = clamp(length(uvn - vec2(0.5, intTopOffset+0.5*ar))*BuconeroDimension-amp*0.05, 0.0, 1.0);
    
    float shadow = pow(smoothstep(0.1, 0.2, grad), 0.25);

	
	vec3 baseColor = vec3(.95, .95, .95);
	if(metal){
		baseColor = vec3(.0, .0, .0);
	}

	// vec3 color = mix(vec3(.95, 1.0, .0), vec3(0.0, 0.0, 1.0), Perlin3D(vec3(uvn*7.3-1.9, uTime*0.95+3.7))*0.5+0.5);
	vec3 color = mix(colorA, colorB, Perlin3D(vec3(uvn*7.3-1.9, uTime*0.95+3.7))*0.5+0.5);
	color = mix(color, baseColor, highlight);
	// color = mix(color*grain, vec3(grain), highlight);
	color = mix(baseColor, color, shadow);
	color = mix(baseColor, color, shape);
	if(metal){
		color = mix(color, vec3(grain), highlight);
	}else{
		color = mix(color*grain, vec3(grain), highlight);
	}

    // Output to screen
	return vec4(color,1.0);
}
void main(){
	gl_FragColor = mainImage(u_audioFreq,vUv * u_resolution.xy);

}