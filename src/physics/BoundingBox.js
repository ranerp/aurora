if (typeof(AURORA) === "undefined") var AURORA = {};

//AABB bounding box
AURORA.BoundingBox = function() {
    this.min;
    this.max;
    this.FLT_MAX = 999999999;

    this.empty();
};

AURORA.BoundingBox.prototype = {

    constructor: AURORA.BoundingBox,

    extendBoundingBox: function(mat4) {

    },

    empty: function() {
        this.min = [this.FLT_MAX, this.FLT_MAX, this.FLT_MAX];
        this.max = [-this.FLT_MAX, -this.FLT_MAX, -this.FLT_MAX];
    },

    add: function(p) {
        if(p[0] < this.min[0]) this.min[0] = p[0];
        if(p[0] > this.max[0]) this.max[0] = p[0];
        if(p[1] < this.min[1]) this.min[1] = p[1];
        if(p[1] > this.max[1]) this.max[1] = p[1];
        if(p[2] < this.min[2]) this.min[2] = p[2];
        if(p[2] > this.max[2]) this.max[2] = p[2];
    },

    //Transforms AABB boundingbox by given transformation 4x4 Matrix.
    transform: function(m) {

        //Location of origin is last row of the matrix (translation part);
        var nMin =  [m[12], m[13], m[14]];
        var nMax = nMin;

        if(m[0] > 0.0) {
            nMin[0] += m[0] * this.min[0]; nMax[0] += m[0] * this.max[0];
        }
        else {
            nMin[0] += m[0] * this.max[0]; nMax[0] += m[0] * this.min[0];
        }

        if(m[1] > 0.0) {
            nMin[1] += m[1] * this.min[0]; nMax[1] += m[1] * this.max[1];
        }
        else {
            nMin[1] += m[1] * this.max[0]; nMax[1] += m[1] * this.min[1];
        }

        if(m[2] > 0.0) {
            nMin[2] += m[2] * this.min[2]; nMax[2] += m[2] * this.max[2];
        }
        else {
            nMin[2] += m[2] * this.max[2]; nMax[2] += m[2] * this.min[2];
        }

        if(m[4] > 0.0) {
            nMin[0] += m[4] * this.min[0]; nMax[0] += m[4] * this.max[0];
        }
        else {
            nMin[0] += m[4] * this.max[0]; nMax[0] += m[4] * this.min[0];
        }

        if(m[5] > 0.0) {
            nMin[1] += m[5] * this.min[0]; nMax[1] += m[5] * this.max[1];
        }
        else {
            nMin[1] += m[5] * this.max[0]; nMax[1] += m[5] * this.min[1];
        }

        if(m[6] > 0.0) {
            nMin[2] += m[6] * this.min[2]; nMax[2] += m[6] * this.max[2];
        }
        else {
            nMin[2] += m[6] * this.max[2]; nMax[2] += m[6] * this.min[2];
        }

        if(m[8] > 0.0) {
            nMin[0] += m[8] * this.min[0]; nMax[0] += m[8] * this.max[0];
        }
        else {
            nMin[0] += m[8] * this.max[0]; nMax[0] += m[8] * this.min[0];
        }

        if(m[9] > 0.0) {
            nMin[1] += m[9] * this.min[0]; nMax[1] += m[9] * this.max[1];
        }
        else {
            nMin[1] += m[9] * this.max[0]; nMax[1] += m[9] * this.min[1];
        }

        if(m[10] > 0.0) {
            nMin[2] += m[10] * this.min[2]; nMax[2] += m[10] * this.max[2];
        }
        else {
            nMin[2] += m[10] * this.max[2]; nMax[2] += m[10] * this.min[2];
        }

        this.min = nMin;
        this.max = nMax;
    }
};