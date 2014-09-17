if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.Texture = function(textureName) {
    this.textureId = textureName;
    this.texture;
};

AURORA.Texture.prototype = {

    constructor: AURORA.Texture,

    createTexture: function(image) {
        this.texture = AURORA.GL.createTexture();
        AURORA.GL.bindTexture(AURORA.GL.TEXTURE_2D, this.texture);
        AURORA.GL.texImage2D(AURORA.GL.TEXTURE_2D, 0, AURORA.GL.RGB, AURORA.GL.RGB, AURORA.GL.UNSIGNED_BYTE, image);
        AURORA.GL.texParameterf(AURORA.GL.TEXTURE_2D, AURORA.GL.TEXTURE_WRAP_S, AURORA.GL.REPEAT);
        AURORA.GL.texParameterf(AURORA.GL.TEXTURE_2D, AURORA.GL.TEXTURE_WRAP_T, AURORA.GL.REPEAT);
        AURORA.GL.texParameteri(AURORA.GL.TEXTURE_2D, AURORA.GL.TEXTURE_MAG_FILTER, AURORA.GL.NEAREST);
        AURORA.GL.texParameteri(AURORA.GL.TEXTURE_2D, AURORA.GL.TEXTURE_MIN_FILTER, AURORA.GL.NEAREST);
        AURORA.GL.bindTexture(AURORA.GL.TEXTURE_2D, null);
    }
};