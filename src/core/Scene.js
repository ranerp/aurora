if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.Scene = function(camera, cameraController, worldContainer, renderer) {

    this.cameras = [];
    this.cameras.push(camera);

    this.cameraController = cameraController;

    this.worldContainer = worldContainer;
    this.renderer = renderer;

    this.activeCamera = this.cameras[0];
};

AURORA.Scene.prototype = {

    constructor: AURORA.Scene,

    addLight: function(light) {
        this.lights.push(light);
    },

    getActiveCamera: function() {
        return this.activeCamera;
    },

    update: function(deltaTime) {
        AURORA.input.getCameraController().moveCameraPosition(deltaTime);

        AURORA.renderer.setObjectsToRender(AURORA.world.getRenderableObjects());
        AURORA.renderer.setDirLightsToRender(AURORA.world.getRenderableDirectionalLights());
        AURORA.renderer.setPointLightsToRender(AURORA.world.getRenderablePointLights());
    },

    render: function() {
        AURORA.renderer.render(this.activeCamera);
    }
};
