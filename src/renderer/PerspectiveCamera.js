if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.PerspectiveCamera = function(fieldOfView, near, far) {
    this.cameraAt = [50.0, 10.0, -10.0];
    this.direction = [-200.0, 0.0, 30.0];
    this.right = [1.0, 0.0, 0.0];
    this.up = [0.0, 1.0, 0.0];

    this.fov = fieldOfView;
    this.near = near;
    this.far = far;

};

AURORA.PerspectiveCamera.prototype = {

    constructor: AURORA.PerspectiveCamera,

    getPerspectiveMatrix: function() {
        var pMatrix = mat4.create();
        mat4.perspective(pMatrix, this.fov, AURORA.GL.viewportWidth / AURORA.GL.viewportHeight, this.near, this.far);

        return pMatrix;
    },

    getViewMatrix: function() {
        var vMatrix = mat4.create();
        var lookAt = vec3.create();

        vec3.add(lookAt, this.cameraAt, this.direction);
        mat4.lookAt(vMatrix, this.cameraAt, lookAt, this.up);

        return vMatrix;
    },

    getDirection: function() {
        return this.direction;
    },

    getPosition: function() {
        return this.cameraAt;
    },

    calculateCoordinateAxises: function(horizontalAngle, verticalAngle) {
        this.direction = [
            Math.cos(verticalAngle) * Math.sin(horizontalAngle),
            Math.sin(verticalAngle),
            Math.cos(verticalAngle) * Math.cos(horizontalAngle)
        ];

        this.right = [
            Math.sin(horizontalAngle - 3.14 / 2),
            0,
            Math.cos(horizontalAngle - 3.14 / 2)
        ];

        vec3.cross(this.up, this.right, this.direction);
    }
};