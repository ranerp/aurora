if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.MATERIAL_TYPES = {
    LAMBERT: "lambert",
    PHONG: "phong",
    BLINNPHONG: "blinnphong"
};

AURORA.Material = function(materialId, MATERIAL_TYPE, diffuse, specular, ambient, texture) {
    this.materialId = materialId;

    this.MATERIAL_TYPE = MATERIAL_TYPE;

    this.diffuse = diffuse;
    this.specular = specular;
    this.ambient = ambient;

    this.texture = texture;
};