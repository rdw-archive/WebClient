class DirectionalLightSource extends LightSource {
	constructor(name = new UniqueID().toString()) {
		super(name);
		const scene = C_Rendering.getActiveScene();

		this.sceneObject = new BABYLON.DirectionalLight(name, new BABYLON.Vector3(1, -1, 1), scene);
		this.sceneObject.specular = BABYLON.Color3.Black();
		// intensity? (TBD)
		// this.shadowGenerator = this.createShadowGenerator()
	}
	setDirection(direction) {
		this.sceneObject.direction = new BABYLON.Vector3(direction.x, direction.y, direction.z);
	}
	getDirection() {
		const direction = this.sceneObject.direction;
		return new Vector3D(direction.x, direction.y, direction.z);
	}
	// This doesn't seem to do anything...
	createShadowGenerator() {
		var shadowVS = `

#include<__decl__sceneVertex>
#include<__decl__meshVertex>

    // Attribute
attribute vec3 position;

uniform vec3 biasAndScaleSM;
uniform vec2 depthValuesSM;
uniform mat4 customWorld;

varying float vDepthMetric;

void main(void)
{
    vec4 worldPos = world * customWorld * vec4(position, 1.0);

    gl_Position = viewProjection * worldPos;

    vDepthMetric = ((gl_Position.z + depthValuesSM.x) / (depthValuesSM.y)) + biasAndScaleSM.x;
}
`;

		var shadowFS = `
#ifndef SM_FLOAT
vec4 pack(float depth)
{
    const vec4 bit_shift = vec4(255.0 * 255.0 * 255.0, 255.0 * 255.0, 255.0, 1.0);
    const vec4 bit_mask = vec4(0.0, 1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0);

    vec4 res = fract(depth * bit_shift);
    res -= res.xxyz * bit_mask;

    return res;
}
#endif

varying float vDepthMetric;

uniform vec3 biasAndScaleSM;
uniform vec2 depthValuesSM;

void main(void)
{
    float depth = vDepthMetric;

#ifdef SM_ESM
    depth = clamp(exp(-min(87., biasAndScaleSM.z * depth)), 0., 1.);
#endif

#ifdef SM_FLOAT
    gl_FragColor = vec4(depth * 0.5, 0.5, 0.5, 0.5);
#else
    gl_FragColor = pack(depth);
#endif
}
`;

		BABYLON.Effect.ShadersStore["customShadowMapVertexShader"] = shadowVS;
		BABYLON.Effect.ShadersStore["customShadowMapFragmentShader"] = shadowFS;

		var shadowGenerator = new BABYLON.ShadowGenerator(1024, this.sceneObject);
		shadowGenerator.customShaderOptions = {
			shaderName: "customShadowMap",
			uniforms: ["customWorld"],
		};
		// shadowGenerator.addShadowCaster(cube); // TBD
		// shadowGenerator.useExponentialShadowMap = true;  // TBD

		// ground.receiveShadows = true; // TBD

		return shadowGenerator;
	}
}
