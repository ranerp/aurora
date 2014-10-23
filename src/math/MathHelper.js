if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.MathHelper = function() {

};

AURORA.MathHelper.prototype = {

    constructor: AURORA.MathHelper,

    getITNormal: function(viewMatrix, modelMatrix) {
        var mvMatrix = mat4.create();
        mat4.multiply(mvMatrix, mvMatrix, modelMatrix);
        mat4.multiply(mvMatrix, viewMatrix, mvMatrix);

        var ITNormal = mat3.create();
        mat3.normalFromMat4(ITNormal, mvMatrix);

        return ITNormal;
    },

    radToDeg: function(rad) {
        return rad * 180 / Math.PI;
    },

    degToRad: function(deg) {
        return deg * Math.PI / 180;
    },

    dotToRad: function(dot) {
        return Math.acos(dot);
    }
};