if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.WorldContainer = function() {
    this.objectsContainer = [];
    this.lightsContainer = [];

    var light = new AURORA.DirectionalLight([150.0, 50.0, 50.0], [-150, -50.0, -50.0], [1.0, 1.0, 1.0], 25);
    this.lightsContainer.push(light);
};

AURORA.WorldContainer.prototype = {

    constructor: AURORA.WorldContainer,

    getRenderableObjects: function() {
        return this.objectsContainer;
    },

    getRenderableLights: function() {
        return this.lightsContainer;
    },

    addObject: function(object) {
        this.objectsContainer.push(object);
    },

    addObjects: function(objects) {
        for(var i = 0; i < objects.length; i++)
            this.objectsContainer.push(objects[i]);
    }
};