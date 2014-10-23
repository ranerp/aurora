if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.BaseLight = function(r, g, b, ambientIntensity, diffuseIntensity, specularPower) {
    this.color = new Float32Array(3);
    this.color[0] = r;
    this.color[1] = g;
    this.color[2] = b;

    this.ambientIntensity = ambientIntensity;
    this.diffuseIntensity = diffuseIntensity;
    this.specularPower = specularPower;
};

AURORA.BaseLight.prototype = {

    constructor: AURORA.BaseLight
};

AURORA.BaseLightDefault = function() {
    return new AURORA.BaseLight(0.8, 0.8, 0.8, 0.9, 0.5, 128.0)
};

AURORA.DirectionalLight = function(baseLight, x, y, z) {
    this.baseLight = baseLight;

    this.direction = new Float32Array(3);
    this.direction[0] = x;
    this.direction[1] = y;
    this.direction[2] = z;
};

AURORA.DirectionalLight.prototype = {

    constructor: AURORA.DirectionalLight
};