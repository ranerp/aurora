if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.KEY_CODES = {
    "0": 48, "n": 78,
    "1": 49, "o": 79,
    "3": 50, "p": 80,
    "4": 51, "q": 81,
    "5": 52, "r": 82,
    "6": 53, "s": 83,
    "7": 54, "t": 84,
    "8": 55, "u": 85,
    "9": 56, "v": 86,
    "a": 65, "w": 87,
    "b": 66, "x": 88,
    "c": 67, "y": 89,
    "d": 68, "z": 90,
    "e": 69, "left_arrow": 37,
    "f": 70, "up_arrow": 38,
    "g": 71, "right_arrow": 39,
    "h": 72, "down_arrow": 40,
    "i": 73,
    "j": 74,
    "k": 75,
    "l": 76,
    "m": 77
};

AURORA.INPUT_CONFIG = {
    "move_left": 37,
    "move_up": 38,
    "move_right": 39,
    "move_down": 40,
    "m_sensitivity": 1.0,
    "m_jaw": 1.0,
    "m_pitch": 1.0,
    "m_speed": 0.2,
    "inverted": false
}

AURORA.Input = function(cameraController) {
    this.cameraController = cameraController;
    this.pointerLocked = false;

    this.mouseDownHandler = this.mouseClickLock.bind(this);
    this.mouseMoveHandler = this.mouseMoveCallback.bind(this);
    this.keyDownHandler = this.keyPressCallback.bind(this);
    this.keyUpHandler = this.keyUpCallback.bind(this);
    this.pointerLockChangeHandler = this.pointerLockChange.bind(this);

};

AURORA.Input.prototype = {

    constructor: AURORA.Input,

    setConfig: function(config) {
        if(config.type != "input") {
            console.log("Wrong config type. Cannot load.");
            return;
        }

        AURORA.INPUT_CONFIG.move_left = AURORA.KEY_CODES[config.keyboard[0].move_left];
        AURORA.INPUT_CONFIG.move_up = AURORA.KEY_CODES[config.keyboard[0].move_up];
        AURORA.INPUT_CONFIG.move_right = AURORA.KEY_CODES[config.keyboard[0].move_right];
        AURORA.INPUT_CONFIG.move_down = AURORA.KEY_CODES[config.keyboard[0].move_down];
        AURORA.INPUT_CONFIG.m_sensitivity = config.mouse[0].sensitivity / 10;
        AURORA.INPUT_CONFIG.inverted = config.mouse[0].inverted;
        AURORA.INPUT_CONFIG.m_jaw = config.mouse[0].jaw / 100;
        AURORA.INPUT_CONFIG.m_pitch = config.mouse[0].pitch / 100;
        AURORA.INPUT_CONFIG.m_speed = config.mouse[0].speed / 1000;
    },

    setCameraController: function(controller) {
        this.cameraController = controller;
    },

    getCameraController: function() {
        return this.cameraController;
    },

    startToListen: function() {
        AURORA.canvas.addEventListener("mousedown", this.mouseDownHandler, false);
        document.addEventListener("pointerlockchange", this.pointerLockChangeHandler, false);
    },

    mouseClickLock: function(e) {
        AURORA.canvas.requestPointerLock();
    },

    pointerLockChange: function(e) {
        this.pointerLocked = !this.pointerLocked;

        if(this.pointerLocked) {
            document.addEventListener("mousemove", this.mouseMoveHandler, false);
            document.addEventListener("keydown", this.keyDownHandler, false);
            document.addEventListener("keyup", this.keyUpHandler, false);
            AURORA.canvas.removeEventListener("mousedown", this.mouseDownHandler, false);
        } else {
            document.removeEventListener("mousemove", this.mouseMoveHandler, false);
            document.removeEventListener("keydown", this.keyDownHandler, false);
            document.removeEventListener("keyup", this.keyUpHandler, false);
            AURORA.canvas.addEventListener("mousedown", this.mouseDownHandler, false);
        }

    },

    mouseMoveCallback: function(e) {
        var x = e.webkitMovementX || e.mozMovementX;
        var y = e.webkitMovementY || e.mozMovementY;
        if(typeof x === "undefined")
            x = 0;
        if(typeof y === "undefined")
            y = 0;

        if(typeof this.cameraController !== "undefined")
            this.cameraController.moveCameraViewpoint(x, y, AURORA.INPUT_CONFIG.m_jaw, AURORA.INPUT_CONFIG.m_pitch, AURORA.INPUT_CONFIG.m_sensitivity);
    },

    keyPressCallback: function(key) {
        if(key.keyCode == AURORA.INPUT_CONFIG.move_left)
            this.cameraController.setMoveLeft(true);
        if(key.keyCode == AURORA.INPUT_CONFIG.move_right)
            this.cameraController.setMoveRight(true);
        if(key.keyCode == AURORA.INPUT_CONFIG.move_up)
            this.cameraController.setMoveUp(true);
        if(key.keyCode == AURORA.INPUT_CONFIG.move_down)
            this.cameraController.setMoveDown(true);
    },

    keyUpCallback: function(key) {
        if(key.keyCode == AURORA.INPUT_CONFIG.move_left)
            this.cameraController.setMoveLeft(false);
        if(key.keyCode == AURORA.INPUT_CONFIG.move_right)
            this.cameraController.setMoveRight(false);
        if(key.keyCode == AURORA.INPUT_CONFIG.move_up)
            this.cameraController.setMoveUp(false);
        if(key.keyCode == AURORA.INPUT_CONFIG.move_down)
            this.cameraController.setMoveDown(false);
    }
};