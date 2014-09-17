if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.Scene = function(camera, worldContainer, renderer) {

    this.cameras = [];
    this.cameras.push(camera);

    this.worldContainer = worldContainer;
    this.renderer = renderer;

    this.activeCamera = this.cameras[0];
};

AURORA.Scene.prototype = {

    constructor: AURORA.Scene,

    addLight: function(light) {
        this.lights.push(light);
    },

    update: function(deltaTime) {
        this.renderer.setObjectsToRender(this.worldContainer.getRenderableObjects());
        this.renderer.setLightsToRender(this.worldContainer.getRenderableLights());
    },

    render: function() {
        this.renderer.render(this.activeCamera);
    }
};
