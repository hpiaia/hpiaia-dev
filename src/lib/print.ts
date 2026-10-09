import { Color, type MeshStandardMaterial } from 'three'

export const printFinish = {
  saturation: 0.68,
  contrast: 0.84,
  paper: '#48423a',
  grain: 0.006,
  roughness: 0.9,
}

export function printedMaterial(original: MeshStandardMaterial) {
  const material = original.clone()
  material.roughness = Math.max(material.roughness, printFinish.roughness)
  material.onBeforeCompile = (shader) => {
    shader.uniforms.printSaturation = { value: printFinish.saturation }
    shader.uniforms.printContrast = { value: printFinish.contrast }
    shader.uniforms.printPaper = { value: new Color(printFinish.paper) }
    shader.uniforms.printGrain = { value: printFinish.grain }
    shader.fragmentShader = `
      uniform float printSaturation;
      uniform float printContrast;
      uniform vec3 printPaper;
      uniform float printGrain;
    ${shader.fragmentShader}`
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `#include <map_fragment>
      #ifdef USE_MAP
        float printLuma = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
        diffuseColor.rgb = mix(vec3(printLuma), diffuseColor.rgb, printSaturation);
        diffuseColor.rgb = mix(printPaper, diffuseColor.rgb, printContrast);
        float printNoise = fract(sin(dot(floor(vMapUv * 512.0), vec2(12.9898, 78.233))) * 43758.5453);
        diffuseColor.rgb = max(vec3(0.0), diffuseColor.rgb + (printNoise - 0.5) * printGrain);
      #endif`,
    )
  }
  material.customProgramCacheKey = () => 'faded-print-v1'
  return material
}
