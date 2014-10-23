if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.PerspectiveCamera = function(fieldOfView, near, far) {
    this.cameraAt = [0.0, 150.0, 100.0];
    this.horizontalAngle = AURORA.Math.degToRad(180);
    this.verticalAngle = AURORA.Math.degToRad(-45);

    this.direction = vec3.create();
    this.up = vec3.create();
    this.right = vec3.create();

    this.fov = fieldOfView;
    this.near = near;
    this.far = far;

    this.calculateCoordinateAxis(this.horizontalAngle, this.verticalAngle);
};

AURORA.PerspectiveCamera.prototype = {

    constructor: AURORA.PerspectiveCamera,

    addAngles: function(hAngle, vAngle) {
        this.horizontalAngle += hAngle;
        this.verticalAngle += vAngle;

        this.calculateCoordinateAxis(this.horizontalAngle, this.verticalAngle);
    },

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

    getRight: function() {
        return this.right;
    },

    calculateCoordinateAxis: function(horizontalAngle, verticalAngle) {
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

        console.log("v: " + AURORA.Math.radToDeg(this.verticalAngle ) + " h: " + AURORA.Math.radToDeg(this.horizontalAngle));
    }
};