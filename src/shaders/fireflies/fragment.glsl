uniform float uTime;

varying float vRandomness;

void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5, 0.5));
    if(distanceToCenter > 0.5) {
        discard;
    }

    float minBrightness = 0.1;
    float maxBrightness = 1.0;
    float brightnessSpeed = vRandomness;

    float variyingTime = sin(uTime * brightnessSpeed) * 0.5 + 0.5;
    float brightness = mix(minBrightness, maxBrightness, variyingTime);

    float strength = (0.05 / distanceToCenter - 0.1) * brightness;
    gl_FragColor = vec4(1.0, 1.0, 1.0, strength);
}
