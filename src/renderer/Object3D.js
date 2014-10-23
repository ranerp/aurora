if (typeof(AURORA) === "undefined") var AURORA = {};

AURORA.Object3D = function(id, mesh) {
    this.id = id;

    this.translation = [0.0, 0.0, 0.0];
    this.rotation  = [0.0, 0.0, 0.0, 0.0];
    this.scale  = [1.0, 1.0, 1.0];

    this.mesh = mesh;

    this.DIRTY_FLAG = true;
    this.modelMatrix = mat4.create();
};

AURORA.Object3D.prototype = {

    constructor: AURORA.Object3D,

    setMesh: function(mesh) {
        this.mesh = mesh;
    },

    setPosition: function(vec3) {
        this.translation = vec3;

        this.DIRTY_FLAG = true;
        this.mesh.setDirtyFlag(true);
    },

    render: function(program, modelMatrixStack, viewMatrix, perspectiveMatrix) {
        modelMatrixStack.push();

        if(this.DIRTY_FLAG)
            this.calculateModelMatrix(modelMatrixStack);
        else
            modelMatrixStack.multiply(this.modelMatrix);

        this.mesh.render(program, modelMatrixStack, viewMatrix, perspectiveMatrix);

        modelMatrixStack.pop();
    },

    calculateModelMatrix: function(modelMatrixStack) {
        modelMatrixStack.rotateTranslate(this.rotation, this.translation);
        modelMatrixStack.scale(this.scale);

        this.modelMatrix = modelMatrixStack.clone();

        this.DIRTY_FLAG = false;
    }
};