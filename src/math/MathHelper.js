if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.MathHelper = function() {

};

AURORA.MathHelper.prototype = {

    constructor: AURORA.MathHelper,

    getMVInvTransp: function(viewMatrix, modelMatrix) {
        var invTransp = mat4.create();
        mat4.multiply(invTransp, invTransp, modelMatrix);
        mat4.multiply(invTransp, invTransp, viewMatrix);
        mat4.invert(invTransp, invTransp);
        mat4.transpose(invTransp, invTransp);

        return invTransp;
    }
};