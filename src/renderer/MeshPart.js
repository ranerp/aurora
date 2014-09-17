if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.MeshPart = function(meshpartId, material, indexBuffer) {
    this.meshpartId = meshpartId;

    this.material = material;

    this.indexBuffer = indexBuffer;
};