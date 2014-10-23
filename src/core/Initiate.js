AURORA.Initiate = function(container, width, height) {
    AURORA.COREPATH = "./";
    AURORA.DEBUG = true;
    AURORA.BREAK_LOOP = false;
    AURORA.canvas = document.getElementById(container);
    AURORA.canvas.setAttribute("width", width);
    AURORA.canvas.setAttribute("height", height);

    AURORA.GL = AURORA.canvas.getContext("webgl", {antialias: false, stencil: true});
    AURORA.GL.viewportWidth = AURORA.canvas.width;
    AURORA.GL.viewportHeight = AURORA.canvas.height;
    AURORA.GL.viewport(0, 0, AURORA.GL.viewportWidth, AURORA.GL.viewportHeight);

    AURORA.canvas.requestPointerLock = AURORA.canvas.requestPointerLock || AURORA.canvas.mozRequestPointerLock ||
                                       AURORA.canvas.webkitRequestPointerLock;

    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;

    AURORA.DEFAULT_INPUT_CONFIG = "input.cfg";

    AURORA.Math = new AURORA.MathHelper();

    if(!this.getDepthExtension(AURORA.GL))
        return;

    AURORA.drawBuffersExt = this.getDrawBuffersExtension(AURORA.GL);
    if(AURORA.drawBuffersExt === false)
        return;


    AURORA.world = new AURORA.WorldContainer();

    AURORA.resources = new AURORA.ResourceManager();
    AURORA.resources.startUp(AURORA.world);

    AURORA.input = new AURORA.Input(new AURORA.CameraController());
    this.loadInputConfig(AURORA.DEFAULT_INPUT_CONFIG);

    AURORA.renderer = new AURORA.Renderer(AURORA.resources);
    AURORA.scene = new AURORA.Scene(new AURORA.PerspectiveCamera(45.0, 0.1, 1000.0), AURORA.world, AURORA.renderer);
    AURORA.looper = new AURORA.Looper(AURORA.scene, AURORA.canvas);

    AURORA.input.startToListen();
};

AURORA.Initiate.prototype = {

    constructor: AURORA.Initiate,

    loadG3DJObject: function(name) {
        AURORA.resources.loadG3DJObject(name);
    },

    loadG3DJObjects: function(name) {
        AURORA.resources.loadG3DJObjects(name);
    },

    loadMap: function(name) {
        AURORA.resources.loadMap(name);
    },

    loadInputConfig: function(filename) {
        AURORA.resources.loadConfig(filename, AURORA.input.setConfig);
    },

    start: function() {
        AURORA.looper.loop();
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



