varying vec2 vUv;
uniform float time;
uniform vec3 uColorStart;
uniform vec3 uColorEnd;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
}