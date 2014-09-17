if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.ScreenDeviceQuad = function() {
    this.positions;
    this.textures;
    this.indices;
    this.numItems;

    this.vboVertices;
    this.vboTextures;
    this.vboIndices;

    this.initialize();
};

AURORA.ScreenDeviceQuad.prototype = {

    constructor: AURORA.ScreenDeviceQuad,

    initialize: function() {
        this.positions = new Float32Array([
                            -1.0, 1.0, 0.0,
                            -1.0, -1.0, 0.0,
                            1.0, -1.0, 0.0,
                            1.0, 1.0, 0.0
                            ]);

        this.textures = new Float32Array([
                            -1.0, 1.0,
                            -1.0, -1.0,
                            1.0, -1.0,
                            1.0, 1.0
                            ]);

        this.indices = [0, 1, 2, 0, 2, 3];
        this.numItems = 6;

        this.vboVertices = AURORA.GL.createBuffer();
        this.bindArrayData(this.vboVertices, this.positions);

        this.vboTextures = AURORA.GL.createBuffer();
        this.bindArrayData(this.vboTextures, this.textures);

        this.vboIndices = AURORA.GL.createBuffer();
        this.bindElementArrayData(this.vboIndices, this.indices);
    },

    bindArrayData: function(buffer, data) {
        AURORA.GL.bindBuffer(AURORA.GL.ARRAY_BUFFER, buffer);
        AURORA.GL.bufferData(AURORA.GL.ARRAY_BUFFER, new Float32Array(data), AURORA.GL.STATIC_DRAW);

    },

    bindElementArrayData: function(buffer, data) {
        AURORA.GL.bindBuffer(AURORA.GL.ELEMENT_ARRAY_BUFFER, buffer);
        AURORA.GL.bufferData(AURORA.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), AURORA.GL.STATIC_DRAW);
    },
};