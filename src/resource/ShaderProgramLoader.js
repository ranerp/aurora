if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.SHADER_TYPE = {
    FRAGMENT_SHADER: "FRAGMENT_SHADER",
    VERTEX_SHADER: "VERTEX_SHADER"
};

AURORA.ShaderProgramLoader = function() {
    this.program;
    this.vs;
    this.fs;
};

AURORA.ShaderProgramLoader.prototype = {

    constructor: AURORA.ShaderProgramLoader,

    loadShaders: function(data) {
        this.vs = this.compileShader(data.vertexShader, AURORA.SHADER_TYPE.VERTEX_SHADER);
        this.fs = this.compileShader(data.fragmentShader, AURORA.SHADER_TYPE.FRAGMENT_SHADER);
    },

    compileShader: function(data, TYPE) {
        var shader;

        var str = "";
        for(var i = 0; i < data.length; i++)
            str += data[i];

        if(TYPE === AURORA.SHADER_TYPE.FRAGMENT_SHADER)
            shader = AURORA.GL.createShader(AURORA.GL.FRAGMENT_SHADER);
        else if(TYPE == AURORA.SHADER_TYPE.VERTEX_SHADER)
            shader = AURORA.GL.createShader(AURORA.GL.VERTEX_SHADER);
        else
            return;

        AURORA.GL.shaderSource(shader, str);
        AURORA.GL.compileShader(shader);

        if(!AURORA.GL.getShaderParameter(shader, AURORA.GL.COMPILE_STATUS)) {
            console.error(AURORA.GL.getShaderInfoLog(shader));
            return;
        }

        return shader;
    },

    createProgram: function(SHADER_PROGRAM_TYPE) {
        if(typeof(this.vs) === "undefined" || typeof(this.fs) === "undefined")
            return;

        this.program = AURORA.GL.createProgram();
        AURORA.GL.attachShader(this.program, this.vs);
        AURORA.GL.attachShader(this.program, this.fs);
        AURORA.GL.linkProgram(this.program);

        if(!AURORA.GL.getProgramParameter(this.program, AURORA.GL.LINK_STATUS)) {
            console.error("Could not initialize shaders for: " + SHADER_PROGRAM_TYPE);
            return;
        }

        return new AURORA.ShaderProgram(this.program, SHADER_PROGRAM_TYPE);
    }
};