if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.Renderer = function(resourceManager) {
    this.resourceManager = resourceManager;

    this.objects;
    this.lights;
    this.screenDeviceQuad = new AURORA.ScreenDeviceQuad();

    this.viewMatrix = mat4.create();
    this.perspectiveMatrix = mat4.create();
    this.modelMatrixStack = new AURORA.MatrixStack();

    this.gBuffer = new AURORA.GBuffer();

    this.geometryPassProgram = new AURORA.GeometryPassProgram(this.resourceManager.loadShaderProgram(AURORA.SHADER_PROGRAM_TYPE.GEOMETRY_PASS));
    this.directionalPassProgram = new AURORA.DirectionalPassProgram(this.resourceManager.loadShaderProgram(AURORA.SHADER_PROGRAM_TYPE.DIRECTIONAL_PASS));
};

AURORA.Renderer.prototype = {

    constructor: AURORA.Renderer,

    render: function(camera) {
        this.viewMatrix = camera.getViewMatrix();
        this.perspectiveMatrix = camera.getPerspectiveMatrix();

        AURORA.GL.enable(AURORA.GL.DEPTH_TEST);
        AURORA.GL.depthFunc(AURORA.GL.LESS);

        this.gBuffer.bindFBOForWriting();
        this.geometryPass(this.objects);
        this.gBuffer.unbindFBOForReading();

        AURORA.GL.enable(AURORA.GL.BLEND);
        AURORA.GL.disable(AURORA.GL.DEPTH_TEST);
        AURORA.GL.blendFunc(AURORA.GL.ONE, AURORA.GL.ONE);

        for(var i = 0; i < this.dirLights.length; i++)
            this.dirPass(this.viewMatrix, this.dirLights[i]);

        AURORA.GL.disable(AURORA.GL.BLEND);
        AURORA.GL.bindFramebuffer(AURORA.GL.FRAMEBUFFER, null);
        AURORA.GL.bindTexture(AURORA.GL.TEXTURE_2D, null);
    },

    geometryPass: function(objects) {
        for(var i = 0; i < objects.length; i++)
            objects[i].render(this.geometryPassProgram, this.modelMatrixStack, this.viewMatrix, this.perspectiveMatrix);
    },

    dirPass: function(viewMatrix, directionalLight) {
        this.directionalPassProgram.activateProgram();

        this.directionalPassProgram.setUniforms(viewMatrix, directionalLight);

        this.directionalPassProgram.setUpTextures(
            this.gBuffer.textures[AURORA.GBUFFER_TEXTURE_TYPE.GBUFFER_TEXTURE_TYPE_DEPTH],
            this.gBuffer.textures[AURORA.GBUFFER_TEXTURE_TYPE.GBUFFER_TEXTURE_TYPE_NORMAL],
            this.gBuffer.textures[AURORA.GBUFFER_TEXTURE_TYPE.GBUFFER_TEXTURE_TYPE_POSITION],
            this.gBuffer.textures[AURORA.GBUFFER_TEXTURE_TYPE.GBUFFER_TEXTURE_TYPE_TEXCOORD]
        );

        this.directionalPassProgram.draw(
            this.screenDeviceQuad.vboVertices,
            this.screenDeviceQuad.vboTextures,
            this.screenDeviceQuad.vboIndices,
            this.screenDeviceQuad.numItems
        );
    },

    setObjectsToRender: function(objects) {
        this.objects = objects;
    },

    setDirLightsToRender: function(lights) {
        this.dirLights = lights;
    },

    setPointLightsToRender: function(lights) {
        this.pointLights = lights;
    }
};