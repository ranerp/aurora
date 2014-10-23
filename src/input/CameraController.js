if(typeof AURORA === "undefined") AURORA = {};

AURORA.CameraController = function() {
    this.moveLeft = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;
};

AURORA.CameraController.prototype = {

    constructor: AURORA.CameraController,

    moveCameraViewpoint: function(x, y, yaw, pitch, sensitivity) {
        var hAngle = yaw * x * sensitivity;
        var vAngle = pitch * y * sensitivity;

        if(AURORA.INPUT_CONFIG.inverted) {
            AURORA.scene.getActiveCamera().addAngles(hAngle, vAngle);
        } else {
            AURORA.scene.getActiveCamera().addAngles(-hAngle, -vAngle);
        }
    },

    setMoveLeft: function(bool) {
        this.moveLeft = bool;
    },

    setMoveUp: function(bool) {
        this.moveUp = bool;
    },

    setMoveRight: function(bool) {
        this.moveRight = bool;
    },

    setMoveDown: function(bool) {
        this.moveDown = bool;
    },

    moveCameraPosition: function(deltaTime) {

        if(this.moveLeft || this.moveRight || this.moveUp || this.moveDown) {
            var hMovement = vec3.create();
            var vMovement = vec3.create();

            vec3.copy(hMovement, AURORA.scene.getActiveCamera().getRight());
            vec3.copy(vMovement, AURORA.scene.getActiveCamera().getDirection());

            vec3.scale(hMovement, hMovement, deltaTime * AURORA.INPUT_CONFIG.m_speed);
            vec3.scale(vMovement, vMovement, deltaTime * AURORA.INPUT_CONFIG.m_speed);

            var cameraPosition = AURORA.scene.getActiveCamera().getPosition();

            if(this.moveLeft)
                vec3.sub(cameraPosition, cameraPosition, hMovement);
            if(this.moveRight)
                vec3.add(cameraPosition, cameraPosition, hMovement);
            if(this.moveUp)
                vec3.add(cameraPosition, cameraPosition, vMovement);
            if(this.moveDown)
                vec3.sub(cameraPosition, cameraPosition, vMovement);

        }
    }
};