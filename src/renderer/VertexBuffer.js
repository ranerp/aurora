if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.VertexBuffer = function(itemSize, numItems, attributes, DRAW_STATE) {
    this.itemSize = itemSize;
    this.numItems = numItems;

    this.buffer;

    this.DRAW_STATE = DRAW_STATE;

    this.createBuffer(attributes);
};

AURORA.VertexBuffer.prototype = {

    constructor: AURORA.VertexBuffer,

    getNumVertices: function() {
        return this.itemSize * this.numItems;
    },

    createBuffer: function(attributes) {
        this.buffer = AURORA.GL.createBuffer();
        AURORA.GL.bindBuffer(AURORA.GL.ARRAY_BUFFER, this.buffer);
        AURORA.GL.bufferData(AURORA.GL.ARRAY_BUFFER, new Float32Array(attributes), this.DRAW_STATE);
    }
};