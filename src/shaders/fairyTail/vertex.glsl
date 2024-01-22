uniform float uPixelRatio;
uniform float uSize;
uniform vec3 uColor;
uniform float uTime;

attribute float aRandomness;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Parámetros de la elipse en el plano XZ
    float a = 1.0; // Semieje mayor en el eje X
    float b = 1.0; // Semieje menor en el eje Z
    float velocidad = 1.0; // Velocidad de rotación

    // Cálculo de la posición elíptica
    modelPosition.x += a * cos(uTime * velocidad) + aRandomness;
    modelPosition.y += 0.25 * sin(uTime * velocidad) + aRandomness;
    modelPosition.z += b * sin(uTime * velocidad) + aRandomness;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = uSize * uPixelRatio;
    gl_PointSize *= (1.0 / -viewPosition.z);
}
