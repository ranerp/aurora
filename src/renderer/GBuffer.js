if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.GBUFFER_TEXTURE_TYPE = {
    GBUFFER_TEXTURE_TYPE_POSITION: 0,
    GBUFFER_TEXTURE_TYPE_NORMAL: 1,
    GBUFFER_TEXTURE_TYPE_DEPTH: 2,
    GBUFFER_TEXTURE_TYPE_TEXCOORD: 3,
    GBUFFER_TEXTURE_TYPE_DEPTHRGB: 4
};

AURORA.GBuffer = function() {

    this.textures = [];
    this.FBO;

    this.initialize();
};

AURORA.GBuffer.prototype = {

    constructor: AURORA.GBuffer,

    initialize: function() {
        this.initTextures();
        this.initFrameBufferObject();
        this.unbindFBOForReading();
    },

    initTextures: function() {
        for(var key in AURORA.GBUFFER_TEXTURE_TYPE) {
            var type = AURORA.GBUFFER_TEXTURE_TYPE[key];

            this.textures[type] = AURORA.GL.createTexture();
            this.initTexture(this.textures[type], type);
        }
    },

    initTexture: function(texture, type) {
        this.bindTexture(texture);
        this.setTextureParameters();
        this.loadTextureData(type);
    },

    bindTexture: function(texture) {
        AURORA.GL.bindTexture(AURORA.GL.TEXTURE_2D, texture);
    },

    setTextureParameters: function() {
        AURORA.GL.texParameteri(AURORA.GL.TEXTURE_2D, AURORA.GL.TEXTURE_MAG_FILTER, AURORA.GL.NEAREST);
        AURORA.GL.texParameteri(AURORA.GL.TEXTURE_2D, AURORA.GL.TEXTURE_MIN_FILTER, AURORA.GL.NEAREST);
        AURORA.GL.texParameteri(AURORA.GL.TEXTURE_2D, AURORA.GL.TEXTURE_WRAP_S, AURORA.GL.CLAMP_TO_EDGE);
        AURORA.GL.texParameteri(AURORA.GL.TEXTURE_2D, AURORA.GL.TEXTURE_WRAP_T, AURORA.GL.CLAMP_TO_EDGE);
    },

    loadTextureData: function(type) {
        if(type === AURORA.GBUFFER_TEXTURE_TYPE.GBUFFER_TEXTURE_TYPE_DEPTH)
            AURORA.GL.texImage2D(AURORA.GL.TEXTURE_2D, 0, AURORA.GL.DEPTH_COMPONENT, AURORA.GL.viewportWidth, AURORA.GL.viewportHeight, 0, AURORA.GL.DEPTH_COMPONENT, AURORA.GL.UNSIGNED_SHORT, null);
        else
            AURORA.GL.texImage2D(AURORA.GL.TEXTURE_2D, 0, AURORA.GL.RGBA, AURORA.GL.viewportWidth, AURORA.GL.viewportHeight, 0, AURORA.GL.RGBA, AURORA.GL.FLOAT, null);
    },

    initFrameBufferObject: function() {
        this.FBO = AURORA.GL.createFramebuffer();
        AURORA.GL.bindFramebuffer(AURORA.GL.FRAMEBUFFER, this.FBO);

        var buffers = [];
        buffers[0] = AURORA.drawBuffersExt.COLOR_ATTACHMENT0_WEBGL;
        buffers[1] = AURORA.drawBuffersExt.COLOR_ATTACHMENT1_WEBGL;
        buffers[2] = AURORA.drawBuffersExt.COLOR_ATTACHMENT2_WEBGL;
        buffers[3] = AURORA.drawBuffersExt.COLOR_ATTACHMENT3_WEBGL;
        AURORA.drawBuffersExt.drawBuffersWEBGL(buffers);

        AURORA.GL.framebufferTexture2D(AURORA.GL.FRAMEBUFFER, AURORA.GL.DEPTH_ATTACHMENT, AURORA.GL.TEXTURE_2D, this.textures[AURORA.GBUFFER_TEXTURE_TYPE.GBUFFER_TEXTURE_TYPE_DEPTH], 0);
        AURORA.GL.framebufferTexture2D( AURORA.GL.FRAMEBUFFER, buffers[0],  AURORA.GL.TEXTURE_2D, this.textures[AURORA.GBUFFER_TEXTURE_TYPE.GBUFFER_TEXTURE_TYPE_DEPTHRGB], 0);
        AURORA.GL.framebufferTexture2D( AURORA.GL.FRAMEBUFFER, buffers[1],  AURORA.GL.TEXTURE_2D, this.textures[AURORA.GBUFFER_TEXTURE_TYPE.GBUFFER_TEXTURE_TYPE_NORMAL], 0);
        AURORA.GL.framebufferTexture2D( AURORA.GL.FRAMEBUFFER, buffers[2],  AURORA.GL.TEXTURE_2D, this.textures[AURORA.GBUFFER_TEXTURE_TYPE.GBUFFER_TEXTURE_TYPE_POSITION], 0);
        AURORA.GL.framebufferTexture2D( AURORA.GL.FRAMEBUFFER, buffers[3],  AURORA.GL.TEXTURE_2D, this.textures[AURORA.GBUFFER_TEXTURE_TYPE.GBUFFER_TEXTURE_TYPE_TEXCOORD], 0);

    },

    bindFBOForWriting: function() {
        AURORA.GL.bindTexture(AURORA.GL.TEXTURE_2D, null);
        AURORA.GL.bindFramebuffer(AURORA.GL.FRAMEBUFFER, this.FBO);
        AURORA.GL.clear(AURORA.GL.DEPTH_BUFFER_BIT | AURORA.GL.COLOR_BUFFER_BIT);
        AURORA.GL.enable(AURORA.GL.DEPTH_TEST);
    },

    unbindFBOForReading: function() {
        AURORA.GL.bindTexture(AURORA.GL.TEXTURE_2D, null);
        AURORA.GL.bindFramebuffer(AURORA.GL.FRAMEBUFFER, null);

        AURORA.GL.disable(AURORA.GL.DEPTH_TEST);
        AURORA.GL.clear(AURORA.GL.COLOR_BUFFER_BIT);
    }
};