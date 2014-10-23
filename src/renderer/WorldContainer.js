if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.WorldContainer = function() {
    this.objects = [];
    this.directionalLights = [];
    this.pointLights = [];

    var light = new AURORA.DirectionalLight(AURORA.BaseLightDefault(), 0.0, -0.5, -0.5);
    this.directionalLights.push(light);
};

AURORA.WorldContainer.prototype = {

    constructor: AURORA.WorldContainer,

    getRenderableObjects: function() {
        return this.objects;
    },

    getRenderableDirectionalLights: function() {
        return this.directionalLights;
    },

    getRenderablePointLights: function() {
        return this.pointLights;
    },

    addObject: function(object) {
        this.objects.push(object);
    },

    addObjects: function(objects) {
        for(var i = 0; i < objects.length; i++)
            this.objects.push(objects[i]);
    }
};