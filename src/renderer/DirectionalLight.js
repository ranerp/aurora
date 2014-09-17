if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.DirectionalLight = function(position, direction, color, power) {
    this.position = position;
    this.direction = direction;
    this.color = color;
    this.power = power;
};

AURORA.DirectionalLight.prototype = {

    constructor: AURORA.DirectionalLight,

    setPosition: function(position) { this.position = position; },

    setDirection: function(direction) { this.direction = direction; },

    setColor: function(color) { this.color = color; },

    setPower: function(power) { this.power = power; },

    getPosition: function() { return this.position; },

    getDirection: function() { return this.direction; },

    getColor: function() { return this.color; },

    getPower: function() { return this.power; }
};