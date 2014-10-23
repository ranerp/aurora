if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.SHADER_PROGRAM_TYPE = {
    LAMBERT: "lambert",
    GEOMETRY_PASS: "geometry.pass",
    DIRECTIONAL_PASS: "directional.pass"
};

AURORA.ShaderProgram = function(program, PROGRAM_TYPE) {
    this.program = program;

    this.TYPE = PROGRAM_TYPE;

    this.quadPositionLocation = 0;
    this.quadTexCoordLocation = 1;

    this.initialize();
};

AURORA.ShaderProgram.prototype = {

    constructor: AURORA.ShaderProgram,

    initialize: function() {
        this.activate();

    },
    activate: function() {
        AURORA.GL.useProgram(this.program);
    }

};