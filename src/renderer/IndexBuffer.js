if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.IndexBuffer = function(itemSize, numItems, attributes, DRAW_STATE) {
    this.itemSize = itemSize;
    this.numItems = numItems;

    this.buffer;

    this.DRAW_STATE = DRAW_STATE;

    this.createBuffer(attributes);
};

AURORA.IndexBuffer.prototype = {

    constructor: AURORA.IndexBuffer,

    createBuffer: function(attributes) {
        this.buffer = AURORA.GL.createBuffer();
        AURORA.GL.bindBuffer(AURORA.GL.ELEMENT_ARRAY_BUFFER, this.buffer);
        AURORA.GL.bufferData(AURORA.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(attributes), this.DRAW_STATE);

    }

};