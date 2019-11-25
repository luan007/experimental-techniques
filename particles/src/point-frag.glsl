uniform float test;
uniform vec3 diffuse;
varying vec2 test3;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
// #include <map_particle_pars_fragment>
uniform mat3 uvTransform;
uniform sampler2D map;
uniform sampler2D alphaMap;
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main(){
    #include <clipping_planes_fragment>
    vec3 outgoingLight=vec3(0.);
    vec4 diffuseColor=vec4(diffuse,opacity);
    #include <logdepthbuf_fragment>
    
    vec2 uv=(uvTransform*vec3(gl_PointCoord.x,1.-gl_PointCoord.y,1)).xy;
    uv=uv/8.;
    uv+=test3;
    
    #ifdef USE_MAP
    vec4 mapTexel=texture2D(map,uv);
    diffuseColor*=mapTexelToLinear(mapTexel);
    #endif
    #ifdef USE_ALPHAMAP
    diffuseColor.a*=texture2D(alphaMap,uv).g;
    #endif
    
    #include <color_fragment>
    #include <alphatest_fragment>
    outgoingLight=diffuseColor.rgb;
    gl_FragColor=vec4(outgoingLight,diffuseColor.a);
    #include <premultiplied_alpha_fragment>
    #include <tonemapping_fragment>
    #include <encodings_fragment>
    #include <fog_fragment>
}