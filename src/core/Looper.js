if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.Looper = function(scene, domElement) {
    this.scene = scene;
    this.domElement = domElement;

    this.lastTime = 0;
    this.deltaTime = 0;

    this.terminationTime = 3;
    this.timer = 0;

    this.requestId;

    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                 window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
};

AURORA.Looper.prototype = {

    constructor: AURORA.Looper,

    calculateDeltaTime: function() {
        var timeNow = new Date().getTime();

        if(this.lastTime != 0)
            this.deltaTime = (timeNow - this.lastTime) / 16;

        this.lastTime = timeNow;

        this.timer += this.deltaTime;
    },

    loop: function() {
        this.requestId = requestAnimationFrame(this.loop.bind(this), this.domElement);

        this.calculateDeltaTime();

        if(this.timer > this.terminationTime)
            this.terminate();
        else {
            this.scene.update(this.deltaTime);
            this.scene.render();
        }
    },

    terminate: function() {
        cancelAnimationFrame(this.requestId);
        console.log("terminated");
    }

};