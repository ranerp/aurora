AURORA.Initiate = function(container) {
    AURORA.COREPATH = "./";
    AURORA.objectsContainer = document.getElementById(container);

    AURORA.GL = AURORA.objectsContainer.getContext("webgl", {antialias: false, stencil: true});
    AURORA.GL.viewportWidth = AURORA.objectsContainer.width;
    AURORA.GL.viewportHeight = AURORA.objectsContainer.height;
    AURORA.GL.viewport(0, 0, AURORA.GL.viewportWidth, AURORA.GL.viewportHeight);

    AURORA.Math = new AURORA.MathHelper();

    if(!this.getDepthExtension(AURORA.GL))
        return;

    AURORA.drawBuffersExt = this.getDrawBuffersExtension(AURORA.GL);
    if(AURORA.drawBuffersExt === false)
        return;


    this.worldContainer = new AURORA.WorldContainer();

    this.resourceManager = new AURORA.ResourceManager();
    this.resourceManager.startUp(this.worldContainer);

    this.renderer = new AURORA.Renderer(this.resourceManager);
    this.camera =  new AURORA.PerspectiveCamera(45.0, 0.1, 1000.0);
    this.scene = new AURORA.Scene(this.camera, this.worldContainer, this.renderer);
    this.looper = new AURORA.Looper(this.scene, AURORA.objectsContainer);
};

AURORA.Initiate.prototype = {

    constructor: AURORA.Initiate,

    loadG3DJObject: function(name) {
        this.resourceManager.loadG3DJObject(name);
    },

    loadG3DJObjects: function(name) {
        this.resourceManager.loadG3DJObjects(name);
    },

    loadMap: function(name) {
        this.resourceManager.loadMap(name);
    },

    start: function() {
        this.looper.loop();
    },

    getDepthExtension: function(GL) {
        console.log("Getting Depth texture extension.");
        GL.getExtension("OES_texture_float");
        GL.getExtension("OES_texture_float_linear");

        var extDepth = GL.getExtension("WEBGL_depth_texture");
        if(!extDepth) {
            console.error("Extension Depth texture is not working.");
            alert("Browser does not support depth texture extension. See webglreport.com for more information.");
            return false;
        }

        console.log("Depth texture extension enabled.");
        return true;
    },

    getDrawBuffersExtension: function(GL) {
        console.log("Getting draw buffers extension.");
        var ext = GL.getExtension("WEBGL_draw_buffers");

        if(!ext) {
            alert("You need WEBGL Draw Buffer Extension. Need to set two flags." +
                "Enable WebGL Draft Extensions Mac, Windows, Linux, Chrome OS, " +
                "Android and Enable D3D11 Windows.");
            return false;
        }

        console.log("Draw buffers extension enabled.");
        return ext;
    }
};



