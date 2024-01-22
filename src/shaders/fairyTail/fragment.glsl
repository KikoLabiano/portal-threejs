uniform vec3 uColor;

void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5, 0.5));
    if(distanceToCenter > 0.7) {
        discard;
    }
    float strength = 0.07 / distanceToCenter - 0.2;
    gl_FragColor = vec4(uColor, strength);
}